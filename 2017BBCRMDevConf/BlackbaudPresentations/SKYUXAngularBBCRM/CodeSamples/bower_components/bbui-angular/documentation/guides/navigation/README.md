# Navigation

One of the nice things about using Angular is the pretty URLs. Let's turn on HTML5 mode to enable this.

<pre><code>
    function config($locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    }

    config.$inject = ['$locationProvider'];

    angular.module('skytutorial')
    .config(config);
</code></pre>

In your index.html, you need to set the `base` tag:

`<base href='/bbappfx/sky/custom/myapp/'>`

## URL Rewriting

We want to be able to rewrite URLs so that `http://localhost/bbappfx/sky/custom/myapp/` or `http://localhost/bbappfx/sky/custom/myapp/constituent/12345` both redirect to `index.html` - that is what makes this a single-page application. There are a couple of ways to do this, but we recommend the approach outlined in this guide. It should work for all set ups, whether hosted or on premise.

Create a new .NET class in some assembly - either make a new assembly or use an existing one if you have one where this class makes sense.

Write an `IHttpHandler` to handle incoming requests and rewrite the URL:

<pre><code>
Imports System.Web

''' &lt;summary>
''' This handler routes HTML5 URLs to the home page.
''' &lt;/summary>
Public NotInheritable Class Html5PageHandler
    Implements IHttpHandler

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            'There is no internal state in this class, so an instance is safe to re-use.
            Return True
        End Get
    End Property

    Public Sub ProcessRequest(context As HttpContext) Implements IHttpHandler.ProcessRequest

        If context Is Nothing Then
            Throw New ArgumentNullException("context")
        End If

        ' Rewrite the URL for HTML5 mode.

        If context.Request.FilePath.EndsWith("/sky/custom/myapp", StringComparison.OrdinalIgnoreCase) Then

            ' When the URL contains no trailing slash AND a query string, IIS does not redirect
            ' appropriately, AngularJS has a javascript error, and the page will fail to load.
            '
            ' Redirect to the same URL but with the trailing slash.
            '
            ' This was tested with fragments (#) and the fragments are preserved upon redirect.

            Dim url = context.Request.Url
            Dim redirect = String.Format(Globalization.CultureInfo.InvariantCulture, "{0}/{1}", url.GetLeftPart(UriPartial.Path), url.Query)
            context.Response.Redirect(redirect)

        Else
            context.Response.WriteFile(context.Request.ApplicationPath & "/sky/custom/myapp/index.html")
        End If

    End Sub

End Class
</code></pre>

In your web.config, enable the handler:

<pre><code>
&lt;configuration>
	&lt;system.web>
		&lt;httpRuntime requestValidationMode="2.0" />
		&lt;compilation debug="false" strict="false" explicit="true">
			&lt;assemblies>
				&lt;add assembly="Blackbaud.CustomFx.MyAssembly"/>
			&lt;/assemblies>
		&lt;/compilation>
		&lt;httpHandlers>
			&lt;add verb="*" path="*" type="Blackbaud.CustomFx.MyAssembly.Html5PageHandler,Blackbaud.CustomFx.MyAssembly" />
		&lt;/httpHandlers>
	&lt;/system.web>
	&lt;system.webServer>
		&lt;validation validateIntegratedModeConfiguration="false"/>
		&lt;handlers>
			&lt;add name="Html5PageHandler" verb="*" path="*" preCondition="integratedMode" type="Blackbaud.CustomFx.MyAssembly.Html5PageHandler,Blackbaud.CustomFx.MyAssembly"/>
		&lt;/handlers>
		&lt;httpCompression directory="mc">
			&lt;dynamicTypes>
				&lt;clear />
			&lt;/dynamicTypes>
		&lt;/httpCompression>
		&lt;httpErrors existingResponse="PassThrough"/>
		&lt;security>
			&lt;authentication>
				&lt;anonymousAuthentication enabled="true" />
			&lt;/authentication>
		&lt;/security>
	&lt;/system.webServer>
&lt;/configuration>
</code></pre>

If you have any files that should not be written back to index.html, such as our bower_components folder, js folder, images, and css, place them into folders in the same directory and add a web.config which disables this handler.

<pre><code>
&lt;configuration>
	&lt;system.webServer>
		&lt;handlers>
			&lt;remove name="Html5PageHandler" />
		&lt;/handlers>
	&lt;/system.webServer>
&lt;/configuration>
</code></pre>