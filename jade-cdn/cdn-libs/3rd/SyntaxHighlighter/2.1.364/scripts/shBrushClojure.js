/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		// var keywords =	'if else cond and or not define lambda let cons car cdr ' +
		// 						'loop nil eq defn';
		// console.log(this.getKeywords(keywords))
		var keywords = /\b(nil|def|defn|fn|letfn|deref|defprotocol|defonce|defmacro|deftype|defrecord|defmethod|var|let|loop|try|split-----split|and|or|not|if|else|cond|lambda|cons|car|cdr|eq|list|error)(?=\(|\)|\s)/gm

		var r = SyntaxHighlighter.regexLib;
		
		this.regexList = [
			{ regex: /(:)[-_0-9a-zA-Z*?!]+/gi,	                   css: 'String'      },  // keyowrd
			// { regex: r.multiLineSingleQuotedString,             css: 'string'      },  // single quoted strings
			// { regex: r.singleLineCComments,                     css: 'comments'    },  // one line comments
			// { regex: r.multiLineCComments,                      css: 'comments'    },  // multiline comments
			{ regex: /((^\s*)|(\s+));.*$/gm,                       css: 'comments'    },  // preprocessor tags like #region and #endregion
			{ regex: /\(|\)|\[|\]|\{|\}/gi,                        css: 'preprocessor'},  // ()
			{ regex: /\\\S/gi,	                                   css: 'value'       },  // char like '\c' '\a'
			{ regex: /\b\d+(\.\d+)?(e\d+)?\b/gi,	                 css: 'value'       },  // number float
			{ regex: /\b(0x[a-fA-F0-9]+)\b/gi,	                   css: 'value'       },  // 0xFFFF
			{ regex: /'([-_0-9a-zA-Z*?!]+|\(\))|\\f|\\t/gi,	       css: 'value'       },  // numbers boolean
			{ regex: /%(\d+|&amp;)/gi,	                           css: 'value'       },  // %1 %1 lambda param
			{ regex: keywords,                                     css: 'keyword'     },	// keywords
			{ regex: /#/gi,	                                       css: 'keyword'     },  // #
			{ regex: /[-_0-9a-zA-Z*?!]+(\?|\!)/gi,	               css: 'keyword'     },  // #
			{ regex: r.multiLineDoubleQuotedString,                css: 'string'      }  // double quoted strings
			// { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword'     }	// keywords
		];
	
		this.forHtmlScript(r.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['clojure', 'clojure', 'clojure'];

	SyntaxHighlighter.brushes.JScript = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
