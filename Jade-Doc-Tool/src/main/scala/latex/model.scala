package jadedoc.latex

import jadedoc.core.model._

object LaTeXCodeFormater extends CodeFormatter {

	def formatDocument(doc: DocumentItem): String = {
		val result = new StringBuffer
		doc match {
			case Chapter(title) => result.append("\n").append("""\chapter{%s}""".format(title)).append("\n")
			case Section(title) => result.append("\n").append("""\section{%s}""".format(title)).append("\n")
			case ctx: Context => result.append("\n")
			case Word(text) => result.append(text)
			case _ => {}
		}
		result.toString
	}

}
