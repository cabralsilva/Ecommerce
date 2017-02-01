<?php
//if(basename(getcwd()) == "public_html")
	$con = @mysql_connect('191.252.53.70', 'producao', 'pd14@56');
	
/*else
	$con = @mysql_connect('191.252.53.70', 'homologacao', 'bc10*90');
*/
if (!$con) {
	echo 'Erro na conexao com o Servidor<br>';
	echo mysql_error();
	exit;
} else {
	//if(basename(getcwd()) == "public_html")
		$database = mysql_select_db('producao',$con);
		//$database = mysql_select_db('producao_dois',$con);
	/*else
		$database = mysql_select_db('homologacao',$con);
	*/
	mysql_set_charset('UTF8', $con);
	if (!$database) {
		echo 'Erro na conexão com o Banco de dados<br>';
		echo mysql_error();
 	}
}
	
@require_once ("fm/FileMaker.php");
global $_conexao;
	
	$_conexao = new FileMaker();
	
	//if(basename(getcwd()) == "public_html")
		$_conexao->setProperty('database', 'Plander');
	/*else
		$_conexao->setProperty('database', 'PlanderHomologacao');
	*/
	$_conexao->setProperty('hostspec', 'ibolthostplander.com.br');
	$_conexao->setProperty('username', 'PHP');
	$_conexao->setProperty('password', 'php');
	
class FM {
	//const
		//HOST = "ibolthost2.com.br",
		//USER = "PHP",
		//PASS = "php";
	private
		$_conn;
		//$_conn,$table,$_db="PlanderX";
	public
		$_found, $_fetchCount;

	function __construct(){
		
		$this->_conn = new FileMaker();
		
		//if(basename(getcwd()) == "public_html")
			$this->_conn->setProperty('database', 'Plander');
		/*else
			$this->_conn->setProperty('database', 'PlanderHomologacao');
		*/
		$this->_conn->setProperty('hostspec', 'ibolthostplander.com.br');
		$this->_conn->setProperty('username', 'PHP');
		$this->_conn->setProperty('password', 'php');
		
	}
	
	function buscaId($_layout, $_id=NULL){
		if ($_id!=NULL){
			$_result = $this->_conn->getRecordById($_layout, $_id);
			if (FileMaker::isError($_result)){
				if ($_result->code==101){
					return  NULL;
				}else{
					echo "erro: " . $_result->code . " - " . $_result->getMessage();
					die();
				}
			}else
				return $_result;
		}
	}
	
	function busca($_layout, $_values=NULL, $_range=NULL, $_operador=NULL, $_sort=NULL){
		$_busca = $this->_conn->newFindCommand($_layout);
		
		if (is_array($_values)){
			$_chaves = array_keys($_values);
			for ($_i=0; $_i<count($_chaves); $_i++){
				$_busca->addFindCriterion($_chaves[$_i], $_values[$_chaves[$_i]]);
			}
		}
		
		if ($_operador!=NULL)
			$_busca->setLogicalOperator($_operador);
		
		if ($_range!=NULL and is_array($_range))
			$_busca->setRange($_range[0], $_range[1]);
		
		if ($_sort!=NULL and is_array($_sort)){
			$_chaves = array_keys($_sort);
			for ($_i=0; $_i<count($_chaves); $_i++){
				$_busca->addSortRule($_chaves[$_i], ($_i+1), strtolower($_sort[$_chaves[$_i]]));
			}
			
		}
		
		$_result = $_busca->execute();
		
		if (FileMaker::isError($_result)){
			if ($_result->code==401){
				return  NULL;
			}else{
				echo "erro: " . $_result->code . " - " . $_result->getMessage();
				die();
			}
		}else{
			$this->_found = $_result->getFoundSetCount();
			$this->_fetchCount = $_result->getFetchCount();
			return $_result->getRecords();
		}
		
	}
	
	function buscaMultipla($_layout, $_values=NULL, $_range=NULL, $_sort=NULL){
		$_busca = $this->_conn->newCompoundFindCommand($_layout);
		
		if (is_array($_values)){
			for ($_i=0; $_i<count($_values); $_i++){
				$_request[$_i] = $this->_conn->newFindRequest($_layout);
				
				$_chaves = array_keys($_values[$_i]);
				for ($_x=0; $_x<count($_chaves); $_x++){
					$_request[$_i]->addFindCriterion($_chaves[$_x], $_values[$_i][$_chaves[$_x]]);
				}
				
				$_busca->add(($_i+1), $_request[$_i]);
			}
		}
		
		if ($_range!=NULL and is_array($_range))
			$_busca->setRange($_range[0], $_range[1]);
		
		if ($_sort!=NULL and is_array($_sort)){
			$_chaves = array_keys($_sort);
			for ($_i=0; $_i<count($_chaves); $_i++){
				$_busca->addSortRule($_chaves[$_i], ($_i+1), strtolower($_sort[$_chaves[$_i]]));
			}
			
		}
		
		$_result = $_busca->execute();
		
		if (FileMaker::isError($_result)){
			if ($_result->code==401){
				return  NULL;
			}else{
				echo "erro: " . $_result->code . " - " . $_result->getMessage();
				die();
			}
		}else{
			$this->_found = $_result->getFoundSetCount();
			$this->_fetchCount = $_result->getFetchCount();
			return $_result->getRecords();
		}
		
	}
	
	function inserir($_layout, $_values){
		$_registro = $this->_conn->createRecord($_layout);
		
		if (is_array($_values)){
			$_chaves = array_keys($_values);
			for ($_i=0; $_i<count($_chaves); $_i++){
				$_registro->setField($_chaves[$_i], $_values[$_chaves[$_i]]);
			}
		}else
			die;
		
		$_registro->commit();
		
		return $_registro;
	}
		function inserirItem($_portal, $_registroPai, $_values){
		$_item = $_registroPai->newRelatedRecord($_portal);
		
		if (is_array($_values)){
			$_chaves = array_keys($_values);
			for ($_i=0; $_i<count($_chaves); $_i++){
				for ($_x=0; $_x<count($_values[$_chaves[$_i]]); $_x++)
					$_item->setField($_chaves[$_i], $_values[$_chaves[$_i]][$_x], $_x);
			}
		}else
			die;
		
		$_item->commit();
		return $_item;
	}
	
	function __destruct(){
		//imagedestroy($this->imagem);
	}
}

?>