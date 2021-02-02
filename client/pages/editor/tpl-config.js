const headStr = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
</head>
<body style="margin: 0">
`

const footStr = `
</body></html>`

const openFixedAreaStr = `
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html;charset=utf-8">
	<script>
		function subst() {
			var vars = {};
			var query_strings_from_url = document.location.search.substring(1).split('&');
			for (var query_string in query_strings_from_url) {
				if (query_strings_from_url.hasOwnProperty(query_string)) {
					var temp_var = query_strings_from_url[query_string].split('=', 2);
					vars[temp_var[0]] = decodeURI(temp_var[1]);
				}
			}
			var css_selector_classes = ['page', 'frompage', 'topage', 'webpage', 'section', 'subsection', 'date', 'isodate', 'time', 'title', 'doctitle', 'sitepage', 'sitepages'];
			for (var css_class in css_selector_classes) {
				if (css_selector_classes.hasOwnProperty(css_class)) {
					var element = document.getElementsByClassName(css_selector_classes[css_class]);
					for (var j = 0; j < element.length; ++j) {
						element[j].textContent = vars[css_selector_classes[css_class]];
					}
				}
			}
		}
	</script>
</head>
<body style="border:0; margin: 0;" onload="subst()">`

const pageStrStyle = '<table style="width: 100%;position:absolute;right:10px;top:10px">'
const pageStrStyleB = '<table style="width: 100%;position:absolute;bottom:10px;right:10px;">'
const pageStr1 = `
  <tr>
    <td class="section"></td>
    <td style="text-align:right">
      第 <span class="page"></span> 页
    </td>
  </tr>
</table>
`

const pageStr2 = `
  <tr>
    <td class="section"></td>
    <td style="text-align:right">
      第 <span class="page"></span> / <span class="topage"></span> 页
    </td>
  </tr>
</table>
`

export {
  headStr,
  footStr,
  openFixedAreaStr,
  pageStr1,
  pageStr2,
  pageStrStyle,
  pageStrStyleB
}