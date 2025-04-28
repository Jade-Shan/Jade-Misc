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
		var keywords = ''
		keywords =	'if else cond and or not define lambda let cons car cdr loop nil eq';
		console.log(this.getKeywords(keywords))

		var keywords = /\b(and|or|not|if|else|cond|define|lambda|let|cons|car|cdr|loop|nil|eq|list|error)(?=\(|\)|\s)/gm

		var r = SyntaxHighlighter.regexLib;
		
		this.regexList = [
			{ regex: r.multiLineDoubleQuotedString,                css: 'string'      },  // double quoted strings
			// { regex: r.multiLineSingleQuotedString,                css: 'string'      },  // single quoted strings
			// { regex: r.singleLineCComments,                        css: 'comments'    },  // one line comments
			// { regex: r.multiLineCComments,                         css: 'comments'    },  // multiline comments
			{ regex: /((^\s*)|(\s+));.*$/gm,                       css: 'comments'    },  // preprocessor tags like #region and #endregion
			{ regex: /\(|\)/gi,                                    css: 'preprocessor'},  // ()
			{ regex: /\b([\d]+(\.[\d]+)?|0x[a-fA-F0-9]+)\b/gi,	   css: 'value'       },  // numbers
			{ regex: /'([-_0-9a-zA-Z*?!]+|\(\))|#f|#t/gi,	         css: 'value'       },  // numbers
			{ regex: keywords                                    , css: 'keyword'     }	// keywords
			// { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword'     }	// keywords
		];
	
		this.forHtmlScript(r.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['scheme', 'scheme', 'scheme'];

	SyntaxHighlighter.brushes.JScript = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
