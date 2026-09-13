package jadedoc.core.model

import scala.collection.mutable.ListBuffer


abstract class DocumentItem {
	var items:List[DocumentItem] = Nil

	private[this] def formatItems(formatter: CodeFormatter): String = {
		val sb = new StringBuffer
		this.items.foreach((item: DocumentItem) => {
				sb.append(item.format(formatter))
			})
		sb.toString
	}

	def format(formatter: CodeFormatter): String = {
		val sb = new StringBuffer
		sb.append(formatter.formatDocument(this))
		sb.append(formatItems(formatter))
		sb.toString
	}
}

abstract class CodeFormatter {

	def formatDocument(doc: DocumentItem): String

}

abstract class ImplementDocumentItem {
	val status: BlockStatus.Value = BlockStatus.Normal
	val items = new ListBuffer[ImplementDocumentItem]
	var currItem: ImplementDocumentItem = null

	var caches = new ListBuffer[String]

	def processLine(line: String)

	private[this] def parseItems(): ListBuffer[DocumentItem] = {
		val subs = new ListBuffer[DocumentItem]
		this.caches.foreach(processLine)
		this.items.foreach( (item: ImplementDocumentItem) => {
				subs += item.parse})
		subs
	}

	protected[this] def parseContext(): DocumentItem

	def parse(): DocumentItem = {
		val result = this.parseContext
		result.items = this.parseItems.toList
		result
	}

}


case class Document extends DocumentItem { }

case class Part(title: String) extends DocumentItem { }

case class Chapter(title: String) extends DocumentItem { }

case class Section(title: String) extends DocumentItem { }

case class SubSection(title: String) extends DocumentItem { }

case class SubSubSection(title: String) extends DocumentItem { }

case class Paragraph(title: String) extends DocumentItem { }

case class SubParagraph(title: String) extends DocumentItem { }

case class SourceCodeInline extends DocumentItem { }

case class FormulaInline extends DocumentItem { }

case class Word(text: String) extends DocumentItem { }

case class Context extends DocumentItem {

}

case class Image extends DocumentItem { }

object BlockStatus extends Enumeration {
	val Normal, Item, Enum, Desc, Code, CodeInline, Forumla, ForumlaInline = Value
}
