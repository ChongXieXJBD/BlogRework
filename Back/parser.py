# T_T coding=utf-8 T_T

"""
Parsing my blog page files.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "Parser"


import re
from utils import convert_to_underline
from markdown_parser import MarkdownParser
from meta_parsers import MetaDataParser
from get_sub_classes import get_all_classes


class Parser(object):
    """
    Parser for blog page files.
    """

    def __init__(self):
        self._markdown_parser = MarkdownParser()

        self._meta_parsers = {}
        for c in get_all_classes(["meta_parsers.py"], MetaDataParser):
            obj = c()
            self._meta_parsers[obj.get_flag()] = obj

        from setting import setting
        self._setting = setting
        self._file_path = ""

    def _split_meta_and_content(self, text):
        tmp = re.match(
            r"([\s\S]*?)\n\n([\s\S]*)",
            text
        )
        if not tmp:
            return False
        return tmp.groups()

    def _meta_parse(self, metas):
        tmp = {}
        for meta in metas.splitlines():
            key, value = re.match(r"(.*?):\s*(.*)", meta.replace("：", ":")).groups()
            key = convert_to_underline(key)
            if key not in self._meta_parsers:
                self._error("Can not find the parser '%s' !" % key)
            tmp[key] = self._meta_parsers[key].parse(value)
        if "authors" not in tmp:
            tmp["authors"] = self._setting["default_authors"]
        for meta_name, meta_obj in self._meta_parsers.items():
            if meta_obj.is_necessary() and meta_name not in tmp:
                self._error("Meta '%s' is necessary !" % meta_name)
        tmp["file"] = self._file_path
        return tmp

    def parse(self, file_path):
        self._file_path = file_path
        with open("%s/%s" % (self._setting["content_path"], file_path)) as f:
            text = f.read()

        result = self._split_meta_and_content(text)
        if not result:
            self._error("Article does not have meta and content !")
        metas, content = result
        metas += "\n%s:%s" % ("Category", file_path.split("/")[-2])
        return {
            "metadata": self._meta_parse(metas),
            "content": self._markdown_parser.parse(content)
        }

    def _error(self, message):
        print message
        print "File: ", self._file_path
        raise