name:= "realtrends_indexer"

organization:="com.realtrends"

version := "1.0"

scalaVersion := "2.10.2"

resolvers += "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"

resolvers += "JetBrain Repo" at "http://repository.jetbrains.com/all/"

resolvers += "SonaType" at "https://oss.sonatype.org/content/repositories/snapshots/"

resolvers += "Maven" at "http://repo1.maven.org/maven2/"

resolvers += "spray repo" at "http://repo.spray.io"

libraryDependencies ++= Seq(
  "info.folone" %% "poi-scala" % "0.10-SNAPSHOT",
  "com.rockymadden.stringmetric" % "stringmetric-core" % "0.25.3",
  "org.elasticsearch" % "elasticsearch" % "1.2.0",
  "io.spray" %% "spray-json" % "1.2.6",
  "net.sf.opencsv" % "opencsv" % "2.3",
  "net.databinder.dispatch" %% "dispatch-core" % "0.11.0",
  "org.specs2"        %%  "specs2"        % "1.14" % "test",
  "org.slf4j"     %   "slf4j-log4j12"   % "1.7.5",
  "junit"				  % "junit"			% "4.11" % "test"
)
