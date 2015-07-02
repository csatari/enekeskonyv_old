<!--Az énekeskönyv így fog kinézni talán...-->
<html>
<head>
    <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <script src="js/jquery-1.11.1.js"></script>
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <script src="js/enekLetolto.js"></script>
    <script>
        $(document).ready(function() {
            var enekletolto = new EnekLetolto(".osszesEnek");
            enekletolto.letoltes();
        });
    </script>
</head>
<body>
<span class="osszesEnek">2,1,3,4,5,6,7,8,9,10</span>
</body>
</html>