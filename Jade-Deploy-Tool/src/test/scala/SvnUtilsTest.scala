package example

import org.slf4j.LoggerFactory
import org.slf4j.Logger

import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.junit.runner.RunWith

import java.util.Properties

import jadeutils.vcs.SvnUtils

@RunWith(classOf[JUnitRunner])
class SvnUtilsTest extends FunSuite {

	test("Test-copy") {
		val username = "qwshan"
		val base = "https://hpfs01.handpay.com.cn:8443/svn/mallModule_mvn/"
		val app = "scc"
		val branch = "rmhubs0623"
		val s: String = SvnUtils.cmdSvnCopy(username, base + app + "trunk/", 
			base + app + "branches/" + app + "-" +branch, 
			"create branch " + branch)
		SvnUtilsTest.logger.debug(s)
	}

	test("Test-CreateBranch") {
		val username = "qwshan"
		val base = "https://hpfs01.handpay.com.cn:8443/svn/mallModule_mvn/"
		val branch = "rmhubs0623"
		("hpMerchantInterface4.0" :: "hpMerchantPlatform4.0" ::
			"hpmerchantService" :: "hpWap4.0" ::
			"hpWapService" :: Nil).foreach(app => 
			SvnUtilsTest.logger.debug(SvnUtils.cmdSvnCreateBranch(username, base, app, branch)))
	}

	test("Test-Checkout") {
		val username = "qwshan"
		val base = "https://hpfs01.handpay.com.cn:8443/svn/mallModule_mvn/"
		val branch = "rmhubs0623"
		("hpMerchantInterface4.0" :: "hpMerchantPlatform4.0" ::
			"hpmerchantService" :: "hpWap4.0" ::
			"hpWapService" :: Nil).foreach(app => 
				SvnUtilsTest.logger.debug(SvnUtils.cmdSvnCheckout(username,
					"%s/%s/branches/%s-%s".format(base, app, app, branch), "")))
	}

}

object SvnUtilsTest { 
	lazy val logger = LoggerFactory.getLogger(this.getClass)

	def getLoggerByName(name: String) = LoggerFactory.getLogger(name)
}
