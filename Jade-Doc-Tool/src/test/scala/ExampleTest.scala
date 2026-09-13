package example

import org.slf4j.LoggerFactory
import org.slf4j.Logger

import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.junit.runner.RunWith

import java.io.PrintWriter
import java.io.File
import java.util.Properties

import jadedoc.latex._

import jadedoc.wiki.WikiDocument
import jadedoc.wiki.WikiChapter
import jadedoc.wiki.Wiki2LaTeX

@RunWith(classOf[JUnitRunner])
class ExampleTest extends FunSuite {

	def doTrans(src: String, tag: String) {
		val writer = new PrintWriter(new File(tag))
		val trans = new Wiki2LaTeX(writer)
		var line = new StringBuffer
		scala.io.Source.fromFile(src).foreach((c: Char) => {
				if (c == '\n') {
					trans processLine (line.toString)
					line = new StringBuffer
				} else {
					line append c
				}
			})
		trans processLine "\n"
		writer close
	}

	test("Test-wiki-tex") {
		doTrans("01.wiki", "tag.tex")
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.proj.into.wiki",      "/home/jade/workspace/study/xmpp-paper/tex/01.tex")   
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.base.wiki",           "/home/jade/workspace/study/xmpp-paper/tex/02.tex")
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.login.wiki",         "/home/jade/workspace/study/xmpp-paper/tex/03.tex")
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.evn.build.wiki",      "/home/jade/workspace/study/xmpp-paper/tex/04.tex")   
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.archtech.base.wiki",  "/home/jade/workspace/study/xmpp-paper/tex/05.tex")       
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.impl.login.wiki",     "/home/jade/workspace/study/xmpp-paper/tex/06.tex")    
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.impl.roster.wiki",    "/home/jade/workspace/study/xmpp-paper/tex/07.tex")     
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.impl.message.wiki",   "/home/jade/workspace/study/xmpp-paper/tex/08.tex")      
		doTrans("/home/jade/workspace/study/notes/wiki/xmpp.impl.overview.wiki",  "/home/jade/workspace/study/xmpp-paper/tex/09.tex")       
	}

}

object ExampleTest { 
	lazy val logger = LoggerFactory.getLogger(this.getClass)

	def getLoggerByName(name: String) = LoggerFactory.getLogger(name)
}
