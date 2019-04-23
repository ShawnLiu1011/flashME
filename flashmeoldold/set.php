<?php
	session_start();
	$username;
	$islogged=false;
	if(isset($_SESSION["username"])){
		$username=$_SESSION["username"];
		$islogged=true;
	}
	if($islogged==false)
	{
		header("Location:error.php?type=mustlogin");
		die();
	}
	$setid=$_GET["setid"];
	$set="data/set/$setid";
	$info=file("$set/info.txt");
?>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <?php print "<title>$info[0]</title>"; ?>
    </head>

    <body>
    	<header>
    		<h1><?=$info[0]?></h1>
    	</header>
    	<div id="menu">
    		
    		<a class="link" href="#"><?=$username?></a>;
    			

    		<a class="link" href="index.php">back</a>
    	</div>

    	<div id="introdution">
    		<h2><?=$info[1]?></h2>
    		<h2><?=$info[2]?></h2>
    	</div>

    </body>
</html>