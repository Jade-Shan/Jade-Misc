package example

import org.slf4j.LoggerFactory
import org.slf4j.Logger

import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.junit.runner.RunWith

import java.util.Properties

@RunWith(classOf[JUnitRunner])
class ExampleTest extends FunSuite {

	test("Test-scalatest") {
		ExampleTest.logger.debug("test scalatest")
		assert(2 > 1)
	}

	test("Test-call-java") {
		ExampleTest.logger.debug("test call java")
		ExampleTest.logger.debug(JavaExample.callJava("Call Java OK"))
		assert("Call Java OK" == JavaExample.callJava("Call Java OK"))
	}

	test("Test-load-prop") {
		val prop: Properties = new Properties()
		prop.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("example.properties"))
		val server = prop.getProperty("conn.server")
		ExampleTest.logger.debug(server)
		// assert("127.0.0.1" == server)
	}

}

object ExampleTest { 
	lazy val logger = LoggerFactory.getLogger(this.getClass)

	def getLoggerByName(name: String) = LoggerFactory.getLogger(name)
}
