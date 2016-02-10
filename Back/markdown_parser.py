"""
Parsing markdown files.
"""

__author__ = "Tianyu Dai (dtysky)"
__email__ = "dtysky@outlook.com"
__name__ = "MarkdownParser"


from markdown import Markdown


class MarkdownParser(object):
    """Parser for Markdown files"""


    def __init__(self):
        self._extensions = {
            'markdown.extensions.codehilite': {'css_class': 'highlight'}
        }
        self._parser = Markdown(
            extensions=self._extensions.keys(),
            extension_configs=self._extensions
        )

    def parse(self, content):
        """Parse content and metadata of markdown files"""

        self._content = content

        return self._parser.convert(self._content)
