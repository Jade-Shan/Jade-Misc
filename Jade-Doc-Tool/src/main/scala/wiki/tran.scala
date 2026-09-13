package jadedoc.wiki

import scala.collection.mutable.ListBuffer
import scala.xml.XML

import jadedoc.core.model._

case class Block {

	var lines = new ListBuffer[String]

}

import java.io.PrintWriter

class Wiki2LaTeX(writer: PrintWriter) {
	import WikiRegex._ 

	var status = BlockStatus.Normal

	private[this] def close() {
		if (status == BlockStatus.Item) writer write ("\n" + """\end{itemize}""")
		if (status == BlockStatus.Code) writer write ("\n" + """\end{lstlisting}""")

		writer write "\n\n"
		status = BlockStatus.Normal
	}

	def processLine(line: String) { 
		// writer write "aaaa"
		line match {
			case tocRegx(title) => {}
			case titleRegx(title)				  => { 
				close()
				writer write """\chapter{%s}""".format(encodeLine(title))
			}
			case chapterRegx(title)       => {  
				close()
				writer write """\chapter{%s}""".format(encodeLine(title))
			}
			case sectionRegx(title)       => { 
				close()
				writer write """\section{%s}""".format(encodeLine(title))
			}
			case subSectionRegx(title)    => { 
				close()
				writer write """\subsection{%s}""".format(encodeLine(title))
			}
			case subSubSectionRegx(title) => { 
				close()
				writer write """\subsubsection{%s}""".format(encodeLine(title))
			}
			case paragraphRegex(title)    => { 
				close()
				writer write """\paragraph{%s}""".format(encodeLine(title))
			}
			case subParagraphRegex(title) => { 
				close()
				writer write """\subparagraph{%s}""".format(encodeLine(title))
			}
			case imgRegex(text) => { 
				close()
				val img = XML.loadString(line)
				val src = (img \ "@src").toString.replaceAll(
					"""images/xmpp\.paper""", "img")
				val id = src.replaceAll("""img/""", "")
				val desc = (img \ "@alt").toString
				val scaling = (img \ "@scaling").toString
				writer write """\begin{figure}[htbp]\centering
					\includegraphics[scale=%s]{%s}\caption{%s}\label{fig:%s}
					\end{figure}""".format(scaling, src, desc, id)
			}
			case itemize1Regex(text) => {
				if (BlockStatus.Normal == status) {
					writer write ("\n\n" + """\begin{itemize}""")
					status = BlockStatus.Item
				}
				writer write ("\n" + """	\item """) + encodeLine(text)
			}
			case itemize2Regex(text) => {
				if (BlockStatus.Normal == status) {
					writer write "\n\n" + """\begin{itemize}"""
					status = BlockStatus.Item
				}
				writer write ("\n" + """	\item """) + encodeLine(text)
			}
			case enumerateRegex(text) => {
				if (BlockStatus.Normal == status) {
					writer write ("\n\n" + """\begin{itemize}""")
					status = BlockStatus.Item
				}
				writer write ("\n" + """	\item """) + encodeLine(text)
			}
			case codeRegex(text) => {
				if (BlockStatus.Normal == status) {
					var language = if ("scala" == text) { "Java" } else { text }
					language = if ("bash" == language) { "Bash" } else { language }
					language = if ("java" == language) { "Java" } else { language }
					writer write ("\n\n" + """\begin{lstlisting}[language=%s]""" + 
						"\n").format(language)
					status = BlockStatus.Code
				}
			}
			case codeEndRegex() => { close() }
			case blankLineRegx() => {
				if (status != BlockStatus.Code && status != BlockStatus.Forumla) {
					close()
				}
			}
			case _ => { writer write encodeLine(line) + "\n" } 
		}
	}

	private[this] def encodeLine(line: String):String = {
		var status = 't'
		val buffer = new StringBuffer
		line.foreach((c: Char) => { 
				if (status == 't' && c == '`') {
					status = 'c'    // 代码
					buffer append """  \verb|"""
				} else if (status == 'c' && c == '`') {
					status = 't'    // 文本
					buffer append """| """
				} else {
					buffer append c
				}
			})
		buffer.toString
	}

}
