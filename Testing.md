How to run automated HAR Viewer tests using Selenium.

### Selenium Requirements ###

  * PHPUnit 3.0 - http://www.phpunit.de
  * Selenium - http://pear.php.net/
  * Java 5 (1.5.0) is needed for Selenium RC - http://java.sun.com
  * Selenium Remote Control (RC) - http://openqa.org/


### Running Selenium Tests ###

<ol>
<li>
Set your HAR viewer server base path in <i>selenium/tests/config.php</i>, e.g.:<br>
<code>$harviewer_base = "http://legoas/har/viewer/";</code>
</li>
<li>
HAR Viewer must be installed on your server in <code>/har/viewer/</code> directory, e.g:<br>
<code>http://&lt;your-domain&gt;/har/viewer/</code>
</li>
<li>
Run Selenium using:<br>
<code>selenium/start-server.bat</code>
</li>
<li>
Change directory to:<br>
<code>cd selenium/tests/</code>
</li>
<li>
Run PHP tests:<br>
<code>phpunit allTests.php</code>
</li>
</ol>