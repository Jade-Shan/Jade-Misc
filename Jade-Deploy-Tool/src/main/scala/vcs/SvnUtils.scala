
package jadeutils.vcs

import org.slf4j.LoggerFactory
import org.slf4j.Logger

class SvnUtils {

}

object SvnUtils {
	lazy val logger = LoggerFactory.getLogger(this.getClass)

	def cmdSvnCheckout(username: String, src: String, dest: String) : String  = 
		"""svn checkout --username=%s %s %s """.format(username, src, dest);

	def cmdSvnCopy(username: String, src: String, dest: String, msg: String) : String = 
		"""svn copy --username=%s %s %s -m "%s" """.format(username, src, dest, msg);
	
	def cmdSvnCreateBranch(username: String, base: String, app: String,
		branch:String) : String = 
	{
		val src = "%s/%s/trunk/".format(base, app)
		val dest = "%s/%s/branches/%s-%s".format(base, app, app, branch)
		val msg = "create branch %s".format(branch)
		SvnUtils.cmdSvnCopy(username, src, dest, msg)
	}

}

