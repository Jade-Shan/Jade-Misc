package jadedoc.wiki

import scala.collection.mutable.ListBuffer

import jadedoc.core.model._

object WikiRegex{
	val blankLineRegx = """^\s*$""".r

	val titleRegx = """^%title\s(.*)$""".r
	val tocRegx   = """^%toc\s(.*)$""".r
	val chapterRegx =              """^=\s(.*)\s=$""".r
	val sectionRegx =             """^==\s(.*)\s==$""".r
	val subSectionRegx =         """^===\s(.*)\s===$""".r
	val subSubSectionRegx =     """^====\s(.*)\s====$""".r
	val paragraphRegex =            """^=====\s(.*)\s=====$""".r
	val subParagraphRegex =        """^======\s(.*)\s======$""".r

	val imgRegex = """<img.*src=['|"](.*)['|"].*/>""".r

	val itemize1Regex = """\s*\*\s(.*)""".r
	val itemize2Regex = """\s*[-]\s(.*)""".r
	val enumerateRegex = """\s*[#]\s(.*)""".r

	val codeRegex = """\{\{\{class="brush:\s?([a-zA-Z]+).*""".r
	val codeEndRegex = """^\s*\}\}\}\s*$""".r
}

class WikiUnknow extends ImplementDocumentItem {
	import WikiRegex._ 

	def processLine(line: String) { 
	}

	protected[this] def parseContext(): DocumentItem = {
		val ctx = new Context()
		ctx.items = new Word("当段内容") :: Nil
		ctx
	}
}

object WikiUnknow {

	def processUnknowLine(wikiDoc: ImplementDocumentItem, line: String) 
	{
		if (null == wikiDoc.currItem) {
			println("=========" + line)
			wikiDoc.currItem = new WikiUnknow
			wikiDoc.items += wikiDoc.currItem
		}
		wikiDoc.currItem.caches += line
	}

}

class WikiDocument extends ImplementDocumentItem {
	import WikiRegex._ 

	def processLine(line: String) { 
		line match {
			case chapterRegx(title) => {
				if (null != currItem) currItem.parse
				currItem = new WikiChapter(title)
				items += currItem
			}
			case titleRegx(title) => {
				if (null != currItem) currItem.parse
				currItem = new WikiChapter(title)
				items += currItem
			}
			case _ => WikiUnknow.processUnknowLine(this, line) 
		}
	}

	protected[this] def parseContext(): DocumentItem = {
		new Document()
	}
}




class WikiChapter(title: String) extends ImplementDocumentItem {
	import WikiRegex._ 

	protected[this] def parseContext(): DocumentItem = new Chapter(title)

	def processLine(line: String) {  
		line match {
			case sectionRegx(title) => {
				if (null != currItem) currItem.parse
				currItem = new WikiSection(title)
				items += currItem
			}
			case _ => WikiUnknow.processUnknowLine(this, line) 
		}
	}

}

class WikiSection(title: String) extends ImplementDocumentItem {
	import WikiRegex._ 

	protected[this] def parseContext(): DocumentItem = new Section(title)

	def processLine(line: String) { 
		line match {
			case subSectionRegx(title) => {
				if (null != currItem) currItem.parse
				currItem = new WikiSubSection(title)
				items += currItem
			}
			case _ => WikiUnknow.processUnknowLine(this, line) 
		}
	}

}

class WikiSubSection(title: String) extends ImplementDocumentItem {
	import WikiRegex._ 

	protected[this] def parseContext(): DocumentItem = new SubSection(title)

	def processLine(line: String) { }

}

class WikiSubSubSection(title: String) extends ImplementDocumentItem {
	import WikiRegex._ 

	protected[this] def parseContext(): DocumentItem = new SubSubSection(title)

	def processLine(line: String) { }

}

class WikiParagraph(title: String) extends ImplementDocumentItem {
	import WikiRegex._ 

	protected[this] def parseContext(): DocumentItem = new Paragraph(title)

	def processLine(line: String) { }

}

class WikiSubParagraph(title: String) extends ImplementDocumentItem {
	import WikiRegex._ 

	protected[this] def parseContext(): DocumentItem = new SubParagraph(title)

	def processLine(line: String) { }

}



