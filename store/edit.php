<?php
require_once("dbconnection/db.php");
require_once("dbconnection/nyelv.php");
require_once("dbconnection/enek.php");
?>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Store</title>
    <script src="../js/jquery-1.11.1.js"></script>
    <!-- Vextab css -->
    <link href="VexTab/vextab.css" rel="stylesheet" type="text/css">
    <link href="VexTab/tabdiv.css" media="screen" rel="Stylesheet" type="text/css">
    <!-- Edit css-->
    <style type="text/css">
        .presenter {
            margin-left:25px;
            margin-top:4%;
            margin-right:25px;
        }
        body {
            margin: 0;
        }
        .hidden {
            visibility: collapse;
            height:0px;
        }
    </style>
    <!-- Support Sources -->
    <script src="VexTab/vexflow-min.js"></script><style type="text/css"></style>
    <script src="VexTab/underscore-min.js"></script>
    <script src="VexTab/tabdiv-min.js"></script>

    <script src="objects/EventCreator.js" charset="utf-8"></script>
    <script src="objects/AbstractElement.js" charset="utf-8"></script>
    <script src="objects/AbstractEmbeddedElement.js" charset="utf-8"></script>
    <script src="objects/GroupTitle.js" charset="utf-8"></script>
    <script src="objects/edit/Editor.js" charset="utf-8"></script>
    <link href="objects/edit/Editor.css" rel="stylesheet" type="text/css">
    <script src="objects/edit/Preview.js" charset="utf-8"></script>
    <link href="objects/edit/Preview.css" rel="stylesheet" type="text/css">
    <script src="objects/edit/Notes.js" charset="utf-8"></script>
    <link href="objects/edit/Notes.css" rel="stylesheet" type="text/css">
    <script src="objects/edit/Options.js" charset="utf-8"></script>
    <link href="objects/edit/Options.css" rel="stylesheet" type="text/css">
    <script src="objects/CssStateSetter.js" charset="utf-8"></script>
    <script>
        $(document).ready(function() {
            var editor = new Editor(".editor");
            var preview = new Preview(".preview");
            var notes = new Notes(".notes");
            var options = new Options(".options");
            options.SetLanguages($(".hidden .languages").text());
            options.SetSongs($(".hidden .songs").text());
        });
    </script>
</head>
<body>
<div class="hidden">
    <span class="languages">
        <?php
        $nyelv = new Nyelv($db);
        $osszesNyelv = $nyelv->getAll();
        echo json_encode($osszesNyelv);
        ?>
    </span>
    <span class="songs">
        <?php
        $enekek = new EnekSQL($db);
        $osszesenek = $enekek->getAll();
        echo json_encode($osszesenek);
        ?>
    </span>
</div>
<div class='presenter'>
    <div class="editor"></div>
    <div class="preview"></div>
    <div class="notes"></div>
    <div class="options"></div>
</div>
</body>
</html>