package com.realtrends

import au.com.bytecode.opencsv.CSVReader
import java.io._
import scala.collection.JavaConversions._
import scala.collection.mutable
import java.util
import scala.io.Source
import org.elasticsearch.common.xcontent.XContentFactory._
import org.elasticsearch.node.NodeBuilder._;
import spray.json._
import DefaultJsonProtocol._
import scala.collection.JavaConverters._
import org.elasticsearch.client.transport.TransportClient
import org.elasticsearch.common.transport.InetSocketTransportAddress
import scala.util.parsing.json.JSONObject
import scala.sys.process.Process
import scala.collection.immutable.Iterable

/**
 * Created with IntelliJ IDEA.
 * User: BELLARKS
 * Date: 7/12/14
 * Time: 6:45 PM
 * To change this template use File | Settings | File Templates.
 */
object Indexer {
  private val spreadSheetFile = {
    this.getClass getResourceAsStream "/all_years.csv"
    //Source fromInputStream works
  }

  private val keysCSVFile = {
    this.getClass getResourceAsStream "/keys_data.csv"
    //Source fromInputStream works
  }

  private val postCodeFile = {
    this.getClass getResourceAsStream "/pc_full_lat_long.csv"
  }

  private lazy val mappings = {
    this.getClass getResourceAsStream "/mappings.json"
  }

  lazy val postCodes: util.List[Array[String]] = {
    new CSVReader(new InputStreamReader(postCodeFile) ) .readAll()
  }

  lazy val keys = {
    val all = new CSVReader(new InputStreamReader(keysCSVFile))    .readAll()
    all.drop(1).map(x => x(0))
  }

  lazy val allData = {
    new CSVReader(new InputStreamReader(spreadSheetFile))    .readAll()
  }

  lazy val postCodeColumns = {
    postCodes(0)
  }

  lazy val mapJson = {
    Source.fromInputStream(mappings).mkString.parseJson
  }

  val getDataYearData  = (year:Int) => {
    val stream = this.getClass getResourceAsStream s"/data_csv/${year.toString}.csv"
    new CSVReader(new InputStreamReader(stream)).readAll()
  }

  def getColumnIndex(csv: java.util.List[Array[String]], colName: String ) = {
       csv(0).indexWhere(x => x equalsIgnoreCase colName)
  }

  val indexPermitScript = "/index_permits.sh"
  val indexMappingSh = "/index_mapping.sh"

  //val serverUrl = "https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io"
  val serverUrl = "https://j2uwpaid31:hpw6yydziz@realtrends-jordan-lo-8230931152.eu-west-1.bonsai.io"

  def main (args: Array[String]) {
    //create the mapping
    //val processBuilder: ProcessBuilder = new ProcessBuilder(indexMappingSh, serverUrl, mapJson.compactPrint)
   //executeProcess(indexMappingSh, serverUrl, mapJson.compactPrint)
   for(i <- 2009 to 2014){
     val fields: mutable.Buffer[Map[String, Any]] = getDataYearData(i).drop(1).map(x => mapToJsonFields(x))
      fields.zipWithIndex.foreach((x) => {
        val body = JSONObject(x._1.toMap)
        val fields = Map(
          "index" -> "building_data",
          "type" -> "permits" ,
          "id" -> x._2.toString, "body " -> body)
        val updateJson = JSONObject(fields).toString().parseJson.compactPrint
        //println(updateJson)
        executeProcess(indexPermitScript,serverUrl,x._2.toString,updateJson.replace("\\n","").replace("\\r",""))
      })
   }
//

  }

  def mapToJsonFields(row: Array[String]): Map[String, Any] = {
    val additional = List("postcode_geocode","Builder_pcode_geocode")
    val mapFields = mapJson.asJsObject.fields("properties").asJsObject.fields

    val jsonFields: Map[String, Any] = mapFields.filter(x => !additional.contains(x._1)).flatMap((prop: (String, JsValue)) => {
      val colIndex = getColumnIndex(allData,prop._1)
      if (colIndex > 0 && colIndex < row.length) {
        val colValue = row(colIndex)
        Map(
          prop._1 -> getValueFromMapping(colValue,prop._2.asJsObject)
        )
      }   else {
        Map(
          prop._1 -> JsNull
        )
      }
    })

    val getKeyColIndex = (key:String) => {
      for {
        i <- mapFields
        if i._1 equalsIgnoreCase key
      }
      yield getColumnIndex(allData, i._1)
    }

    val pcodeColIndex: Iterable[Int] = getKeyColIndex("site_pcode")

    val toLatLngArray = (lnglat:List[(String,String)])  => {
      lnglat match {
        case x: List[(String, String)] => {
          if(x.isEmpty) {
            JsNull
          } else {
            JsArray(List(JsNumber(x(0)._1),JsNumber(x(0)._2)))
          }
        }
        case _ => JsNull
      }
    }
    val intFields = if(pcodeColIndex.isEmpty)  {
      jsonFields
    }  else {
      val index: Int = pcodeColIndex.toSeq(0)
      val lnglat = toLatLngArray(getLatLongFromPostCode(row(index)))

      jsonFields + ("postcode_geocode" -> lnglat)
    }

    val builderColIndex: Iterable[Int] = getKeyColIndex("Builder_pcode")

    if(builderColIndex.isEmpty)  {
      intFields
    }  else {
      val index: Int = pcodeColIndex.toSeq(0)
      val lnglat = toLatLngArray(getLatLongFromPostCode(row(index)))

      intFields + ("Builder_pcode_geocode" -> lnglat)
    }
  }

  def executeProcess(script:String, args:String* ) = {
     val rs = this.getClass getResource script

    val params = args.toSeq
    //println(params)
    try {
      val process = Process("sh",s"${rs.getPath}"+:params)
      val shellExitStatus = process.!!
      println(shellExitStatus)
    } catch {
      case ex: Throwable => {
        System.out.println("Shell Script process is interrupted")
        println(ex)
      }
    }


  }

  def getValueFromMapping(value: String, jsObject: JsObject) = {
    jsObject.fields("type").toString() match {
      case "integer" => JsNumber(value)
      case _ => JsString(value)
    }
  }

  def getLatLongFromPostCode(str: String): List[(String, String)]= {
    val pcodeIndex = getColumnIndex(postCodes,"Pcode")
    val latIndex = getColumnIndex(postCodes,"Lat")
    val lngIndex = getColumnIndex(postCodes,"Long")

    postCodes.drop(1).filter(x => x(pcodeIndex) equalsIgnoreCase  str).map{
      y => (y(lngIndex), y(latIndex))
    }.toList
  }


}
