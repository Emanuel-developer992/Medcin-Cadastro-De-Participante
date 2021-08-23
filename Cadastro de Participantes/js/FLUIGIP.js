/*
FLUIGIP v4
REGRAS DE DOCUMENTAÇÃO
- Sempre utilizar o seguinte modelo:

     * Função nomeDaFuncao
     * @description Incluir uma descrição suficiente para que o programador consiga entender claramente qual é a finalidade da função sem precisar ter acesso ao código fonte
	 * @memberof Especificar o "pai" da função. Ex.: TABLE
	 * @example Exemplo funcional de como utilizar a função. Ex.: FLUIGIP.writeForState();
	 * @example Lista de tags, separadas por vírgula. A tag com o nome da função pai é obrigatória. Ex.: table, teste, teste1, teste2, teste3
	 * @example Caso exista alguma imagem para exemplificar o uso, ela pode ser informada aqui. Caso não haja, deixar o @example em branco Ex.: 
	 * @author Nome do criador da função 
	 
Caso a função tenha uma nova versão com um novo nome e/ou esteja descontinuada apontar como deprecated e indicar o nome da nova função
	 * @deprecated nomeDaNovaFuncao


Caso existam parâmetros, informe o tipo de cada parâmetro (ex.: {int} ou {*}, para any). Em seguida, informe o nome do parâmetro e a descrição do mesmo

     * @param {*} conditional Variável a ser verificada

Caso exista retorno, informe o tipo (ex.: {int} ou {*}, para any). Em seguida, informe a descrição do mesmo
	 * @returns {boolean}  True | False
 */

FLUIGIP = new FLUIGIP(); 

function FLUIGIP(){
	/**
     * Função writeForState
     * @description Verifica se cada campo é obrigatório (fluig-required == true) e válido (fluig-state-valid possui o valor de getWKNumState() ou '*' no array). Caso seja, retira o atributo readOnly do mesmo.
	 * @memberof FLUIGIP
	 * @example FLUIGIP.writeForState();
	 * @example FLUIGIP, campo obrigatório, campo válido, readOnly, state
	 * @example
	 * @author
     */
	this.writeForState = function(){
		//pra cada input, select e textarea
		$("input,select,textarea").each(function(){
			//var states;
			var required;

			//verifica o tipo do campo e recebe os valores especificados para fluig-required e fluig-state-valid
			if ($(this).attr("type") == "zoom"){
				required 	= $(this).parent("div").data("fluig-required");
				//states   	= $(this).parent("div").data("fluig-state-valid");
			} else if($(this).attr("type") == "radio"){
				required 	= $(this).parent("label").parent("div").data("fluig-required");
				//states   	= $(this).parent("label").parent("div").data("fluig-state-valid");
			} else if($(this).attr("type") == "checkbox"){
				required 	= $(this).closest(".input-group").data("fluig-required");
				//states   	= $(this).closest(".input-group").data("fluig-state-valid");
			} else {
				required 	=  $(this).data("fluig-required");
				//states   	=  $(this).data("fluig-state-valid");
			}

			//se as variaveis possuirem valores setados
			//if ( (typeof required != 'undefined') && (typeof states != 'undefined') ){
			if ( (typeof required != 'undefined')){
				
				/*states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",");*/

				//Se a variavel required for true? e (o WKNumState  ou * estiverem presentes no array)
				//if ( eval(required) && (states.indexOf(getWKNumState()) != -1  || states.indexOf("*") != -1) ) {
				if (eval(required)) {
					//desabilita o readonly
					FLUIGIP.execChangeFields($(this), false);
				}
			}
		});
	}

	/**
     * Função setReadOnlyByStates
     * @description Atribui a propriedade readOnly para cada campo que possuir o valor de getWKNumState() ou '*' na propriedade fluig-state-readonly.
	 * @memberof FLUIGIP
	 * @example FLUIGIP.setReadOnlyByStates();
	 * @example FLUIGIP, fluig-state-readonly, readOnly, state
	 * @example 
	 * @author
     */

	this.setReadOnlyByStates = function(){
		$(".form-control").each(function(){
			if ($(this).attr("type") == "zoom"){
				var states =  $(this).parent("div").data("fluig-state-readonly");
			} else {
				var states =  $(this).data("fluig-state-readonly");
				if (states == undefined) {
					var states =  $(this).parent("div").data("fluig-state-readonly");
				}
			}
			if (typeof states != 'undefined'){
				states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",")
				if(states.indexOf(getWKNumState()) != -1 || states.indexOf("*") != -1 ){
					if ($(this)[0].type == "select-one"){
						var campo = '#'+$(this)[0].id +' option:not(:selected)' ;
						$(campo).attr('disabled', true);
						$('#'+$(this)[0].id).prop('readOnly', true);
						$('select#'+$(this)[0].id).css("background", "#eee");
					}else if ($(this)[0].type == "checkbox"){
						$(this).attr("onclick", "return false");
					}else{
						$(this).prop('readonly', true);
						if ($(this).hasClass("zoom-tdi")){
							$(this).data("fluig-onchange", $(this).next('div').attr('onclick'));
							$(this).next('div').attr('onclick', 'return false');
						}
					}
				}
			}
		});
		$("input:radio").each(function(){
			var states =  $(this).parent("label").parent("div").data("fluig-state-readonly");
			if (typeof states != 'undefined'){
				states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",")
				if(states.indexOf(getWKNumState()) != -1 || states == "*"){
					//$(this).attr("disabled", true);
					$(this).attr("onclick", "return false");
				}
			}
		});
		$("input:checkbox").each(function(){
			var states =  $(this).closest(".input-group").data("fluig-state-readonly");
			if (typeof states != 'undefined'){
				states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",")
				if(states.indexOf(getWKNumState()) != -1 || states == "*"){
					$(this).attr("onclick", "return false");
					FLUIGC.switcher.isReadOnly("#"+$(this).attr('id'), true);
				}
			}
		});
	}

	/**
     * Função setHideElementsByStates
     * @description Oculta todos os elementos que possuam no atributo data-fluig-state-hide o valor de getWKNumState() ou '*'. Oculta todos os elementos que possuam no atribulo data-fluig-conditional-hide uma expressão booleana que retorne true.
	 * @memberof FLUIGIP
	 * @example FLUIGIP.setHideElementsByStates();
	 * @example FLUIGIP, state, fluig-state-hide, 
	 * @example 
	 * @author
     */
	//FIXME: Não testado
	this.setHideElementsByStates = function(){
		
		$("[data-fluig-hide]").each(function () {
			//var states = $(this).data("fluig-state-hide");
			var conditional = $(this).data("fluig-conditional-hide");

			var keep = FLUIGIP.validConditional(conditional);
			var validConditional = keep ? eval(conditional) : true ;
			
			//if ((typeof states != 'undefined') && (validConditional)) {
			if (validConditional) {
				$(this).hide();
				/*states = (typeof states == "number" ? states.toString() : states);
				states = states.split(",")
				if (states.indexOf(getWKNumState()) != -1 || states == "*") {
					$(this).hide();
				}*/
			}
		});
		
		/*$("[data-fluig-trash-states-hide]").each(function(){
			var states =  $(this).data("fluig-trash-states-hide");
			if (typeof states != 'undefined' && getFormMode() != "VIEW"){
				states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",")
				if(states.indexOf(getWKNumState()) != -1 || states == "*"){
					$("#" + $(this).attr("id") + " thead tr th:first").hide();
					$("#" + $(this).attr("id") + " tbody tr td.bpm-mobile-trash-column").hide();
				}
			}
		});*/

		//TODO: analisar aderencia/uso
		/*if (getFormMode() == "VIEW"){
			$("[data-fluig-show-mode-view]").each(function(){
				var modeview =  $(this).data("fluig-show-mode-view");
				if (typeof modeview != 'undefined'){
					if(!eval(modeview)){
						$(this).hide();
					}
				}
			});
		}*/
	}

	/**
     * Função setWriteFieldByClass
     * @description Retira o atributo readOnly de todos os campos que possuem a classe informada.
	 * @memberof FLUIGIP
     * @param {string} classeName Classe dos campos que serão alterados
	 * @example FLUIGIP.setWriteFieldByClass('.form-control');
	 * @example FLUIGIP, readOnly, classe
	 * @example 
	 * @author
     */
	this.setWriteFieldByClass = function(classeName) {
		//$("classeName).each(function () {
		$(classeName).each(function () {
			FLUIGIP.execChangeFields($(this), false);			
		});
	}

	/**
     * Função removeAlertValidation
     * @description Remove o alerta de erro de validação de cada input, quando o mesmo é alterado.  Por padrão, o método é chamado automaticamente para todos os inputs que possuam a classe form-control ou que sejam do tipo rádio e checkbox.
	 * @memberof FLUIGIP
	 * @example FLUIGIP.removeAlertValidation();
	 * @example FLUIGIP, validação
	 * @example 
	 * @author
     */
	this.removeAlertValidation = function(){
		$(document).on('change', '.form-control',function(){
			$(this).removeClass("has-error-table");
			$(this).parent("div").removeClass("has-error");
			$(this).closest(".input-group").parent("div").removeClass("has-error");
			$(this).parent("div").find("span[role='combobox']").removeClass("has-error-table");
		});
		$(document).on('change', 'input:radio',function(){
			$(this).parent("label").parent("div").parent("div").removeClass("has-error");
		});
		$(document).on('change', 'input:checkbox',function(){
			$(this).closest(".input-group").parent("div").removeClass("has-error");
		});
	}

	/**
     * Função setLabelRequiredByStates
     * @description Atribui as classes 'control-label' e 'required' às labels de campos obrigatórios e válidos. Entende-se por obrigatório o campo que possuir fluig-required == true e por válido aquele em que o fluig-state-valid tem em seu array o valor de getWKNumState() ou '*'. 
	 * @memberof FLUIGIP
	 * @example FLUIGIP.setLabelRequiredByStates();
	 * @example FLUIGIP, state, control-label, fluig-required
	 * @example 
	 * @author
     */
	this.setLabelRequiredByStates = function(){
		$("input,select,textarea").each(
				function() {
					var required
					//var states

					if ($(this).attr("type") == "zoom"){
						required = $(this).parent("div").data("fluig-required");
						//states   = $(this).parent("div").data("fluig-state-valid");
					} else if ($(this).attr("type") == "radio"){
						required = $(this).parent("label").parent("div").data("fluig-required");
						//states   = $(this).parent("label").parent("div").data("fluig-state-valid");
					} else if ($(this).attr("type") == "checkbox"){
						required = $(this).closest(".input-group").data("fluig-required");
						//states   = $(this).closest(".input-group").data("fluig-state-valid");
					} else {
						required = $(this).data("fluig-required");
						//states   = $(this).data("fluig-state-valid");
					}

					//if ((typeof required != 'undefined') && (typeof states != 'undefined')) {
					if ((typeof required != 'undefined')) {

						/*states = (typeof states == "number" ? states.toString()
								: states);
						states = states.split(",");*/

						//if (eval(required) && (states.indexOf(getWKNumState()) != -1 || states.indexOf("*") != -1)) {
						if (eval(required)) {
							if ($(this).attr("type") == "radio"){
								$(this).parent("label").parent("div").siblings("label").attr('class','control-label required');
							} else if ($(this).attr("type") == "checkbox"){
								$(this).closest(".input-group").siblings("label").attr('class','control-label required');
							} else if ($(this).closest('.input-group').length > 0){
								$(this).closest('.input-group').siblings("label").attr('class','control-label required');
							} else {
								$(this).siblings("label").attr('class','control-label required');
							}
						}

					}

				});
	}

	

	/**
     * Função setWriteFieldByState
     * @description Retira a propriedade readOnly de todos os campos que possuam no atributo fluig-write o valor de getWKNumState() ou '*'.
	 * @memberof FLUIGIP
	 * @example FLUIGIP.setWriteFieldByState();
	 * @example FLUIGIP, state, readOnly, fluig-write
	 * @example
	 * @author
     */
	this.setWriteFieldByState = function() {
		$(".form-control").each(function(){
			if ($(this).attr("type") == "zoom"){
				var required =  $(this).parent("div").data("fluig-write");
			} else {
				var required =  $(this).data("fluig-write");
				if (required == undefined) {
					var required =  $(this).parent("div").data("fluig-write");
				}
			}
			if (typeof required != 'undefined'){
				/*states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",")*/
				//if(states.indexOf(getWKNumState()) != -1 || states.indexOf("*") != -1){
				if (eval(required)) {
					FLUIGIP.execChangeFields($(this), false);
				}
			}
		});
		
		
		/*$(".form-control").each(function(){
			if ($(this).attr("type") == "zoom"){
				var states =  $(this).parent("div").data("fluig-write");
			} else {
				var states =  $(this).data("fluig-write");
				if (states == undefined) {
					var states =  $(this).parent("div").data("fluig-write");
				}
			}
			if (typeof states != 'undefined'){
				states = (typeof states == "number" ? states.toString()  : states);
				states = states.split(",")
				if(states.indexOf(getWKNumState()) != -1 || states.indexOf("*") != -1){
					FLUIGIP.execChangeFields($(this), false);
				}
			}
		});*/
	}

	/**
     * Função setReadOnly
     * @description Atribui a propriedade readOnly a todos os campos que possuem a classe ou o id informado. Utilize o nome da classe com ponto (ex .form-control) ou o id com # (ex #userName).
	 * @memberof FLUIGIP
     * @param {string} selector Seletor do(s) campo(s) a ser(em) alterado(s)
	 * @example FLUIGIP.setReadOnly(".form-control"); FLUIGIP.setReadOnly("#userName"); 
	 * @example FLUIGIP, readOnly, classe
	 * @example 
	 * @author
     */
	this.setReadOnly = function(selector) {
		$(selector).each(function () {
			FLUIGIP.execChangeFields($(this), true);
		});
	}

	/**
     * Função execChangeFields
     * @description Altera a propriedade "readOnly" do objeto, de acordo com os parâmetros passados. Além do objeto a ser atualizado, o método também recebe o parâmetro que informa se o objeto deve ter a propriedade readOnly (true) ou não (false).
	 * @memberof FLUIGIP
     * @param {obj} obj Objeto a ser alterado
	 * @param {boolean} change True ou False
	 * @example FLUIGIP.execChangeFields($(this), false);
	 * @example FLUIGIP, readOnly
	 * @example 
	 * @author
     */
	
	this.execChangeFields = function(obj, change) {
		
		switch (obj[0].type) {
			case "file":
			case "password":
			case "text":
			case "zoom":
			case "number":
			case "email":
			case "textarea":
				obj.attr('readonly', change);
				if(obj.hasClass("zoom-tdi")){
					if(change){
						obj.data("fluig-onchange", obj.next('div').attr('onclick'));
						obj.next('div').attr('onclick', 'return false');
					}else{
						obj.next('div').attr('onclick', obj.data("fluig-onchange"));
					}
				}
				break;
			case "checkbox":
			case "radio":
				if (change) {
					obj.attr('onclick', 'return false');
				}else{
					obj.attr('onclick', '');
				}
				break;
			case "select-one":
				$('#'+obj[0].name + ' option:not(:selected)').attr('disabled', change);
				obj.attr('readonly', change);
				break;
			case "image":
			case "button":
			if (change) {
				obj.show();
				break;
			} else {
				obj.hide();
					break;
				}
		}
		
		if(change){
			obj.attr("tabindex","-1");
		}else{
			obj.removeAttr("tabindex");
		}
	}

	/**
     * Função validConditional
     * @description Verifica se a variavel informada possui um tipo válido, ou seja, se seu tipo é diferente de nulo, indefinido ou vazio.
	 * @deprecated isValid
	 * @memberof FLUIGIP
     * @param {any} conditional Variável a ser verificada
	 * @returns {boolean}  True | False
	 * @example variavelTemTipo = FLUIGIP.validConditional(variavel);
	 * @example FLUIGIP, válido, validação, verificação
	 * @example 
	 * @author
     */
	this.validConditional = function(conditional){
		if(typeof conditional == 'undefined' || typeof conditional == null || typeof conditional == ""){
			return false;
		} else {
			return true;
		}
	}

	/**
     * Função isValid
     * @description Verifica se a variavel informada possui um tipo válido, ou seja, se seu tipo é diferente de nulo, indefinido ou vazio.
	 * @memberof FLUIGIP
     * @param {*} conditional Variável a ser verificada
	 * @returns {boolean}  True | False
	 * @example variavelTemTipo = FLUIGIP.isValid(variavel);
	 * @example FLUIGIP, válido, validação, verificação
	 * @example 
	 * @author
     */
	this.isValid = function(conditional){
		if(typeof conditional == 'undefined' || typeof conditional == null || typeof conditional == ""){
			return false;
		} else {
			return true;
		}
	}

	/**
     * Função updCalendar
     * @description Atualiza os campos do tipo calendario. Esse método é chamado toda vez que um campo que possua a classe '.calendar' recebe o foco. Caso o campo possua o atributo readOnly, o método previne seu conteúdo de ser alterado. Caso não possua, o método apenas remove o erro de validação, se houver. Por padrão, o método é chamado automaticamente para todos os inputs que possuam a classe '.calendar'.
	 * @memberof FLUIGIP
	 * @example FLUIGIP.updCalendar();
	 * @example FLUIGIP, readOnly, calendário
	 * @example
	 * @author
     */
	this.updCalendar = function(){
		$(document).on('focus',".calendar",function() {
			if ($(this).attr("readonly") != "readonly")
				var calendario = FLUIGC.calendar(this);
			$(this).removeClass('error');
			});
		$(document).on('keydown', ".calendar", function(e) {
			e.keyCode = 0;
			return false;
		});
	}
	/**
	* Função setSwitcher
	* @description Transforma um ou mais campos (checkbox ou radio button) em switcher.
	* @memberof FLUIGIP
	* @param {string} selector seletor do(s) campo(s)
	* @example FLUIGIP.setSwitcher("#id"); FLUIGIP.setSwitcher(".bonecas");
	* @example FLUIGIP, checkbox, radio button, switcher, set, campo
	* @example
	* @author Andressa Oliveira
	*/
	this.setSwitcher= function(selector){
		FLUIGC.switcher.init(selector);
		FLUIGC.switcher.onChange(selector, function(event, state){
			$(selector).closest(".input-group").parent("div").removeClass("has-error");
		});
	}
	/**
	* Função setSwitcherByName
	* @description Transforma um ou mais campos (checkbox ou radio button) em switcher.
	* @memberof FLUIGIP
	* @param {string} name name do(s) campo(s)
	* @example FLUIGIP.setSwitcherByName("genero"); 
	* @example FLUIGIP, checkbox, radio button, switcher, set, name, campo
	* @example
	* @author Andressa Oliveira
	*/
	this.setSwitcherByName= function(name){
		name = "input[name='"+ name +"']"
		FLUIGC.switcher.init(name);
		FLUIGC.switcher.onChange(name, function(event, state){
			$(name).closest(".input-group").parent("div").removeClass("has-error");
		});
	}


	//Propriedade TABLE
	
	this.TABLE = {
		/**
		 * Função getTableSize
		 * @description Retorna o total de linhas da tabela, ignorando as linhas que fazem parte do cabeçalho.
		 * @memberof TABLE
		 * @param {string} tableId Id da tabela
		 * @param {int} tamCab Tamanho do cabeçalho, ou seja, linhas a serem ignoradas na contagem
		 * @returns {int} Total de linhas que a tabela possui, sem contabilizar o cabeçalho
		 * @example numLinhas = FLUIGIP.TABLE.getTableSize("tabelaClientes", 2); 
		 * @example TABLE, get, tabela, linhas
		 * @example 
		 * @author
		 */
		getTableSize: function(tableId,tamCab){ 
			//TODO verificar se o nome nao irá confundir com funcoes da MATRIZ
			tamCab = (typeof tamCab !== 'undefined') ? tamCab : 1;
			var seletor = "#"+tableId + " tr";
			var contador = 0 - (tamCab + 1);
			$(seletor).each(function(){
				contador++;
			});
			
			return contador;
		},

		/**
		 * Função clearTable
		 * @description Apaga todas as linhas da tabela e mostra uma mensagem ao finalizar
		 * @memberof TABLE
		 * @param {string} tableName tableName da tabela
		 * @param {string} msg Mensagem
		 * @example FLUIGIP.TABLE.clearTable("minhaTabela", "Finalizado com sucesso!");
		 * @example TABLE, deletar, tabela, linhas
		 * @example 
		 * @author
		 */
		//FIXME: Não testado
		clearTable: function(tableName,msg){
			var contador = 0;
			$("#"+tableName + " tr").each(function(){
				contador++;
				if(contador > 2){
					fnWdkRemoveChild(this); 
				}
			});
			rowIndex[tableName] = 0;
			if (contador > 0) {
				 if (!FLUIGIP.USEFUL.isNull(msg)) {
					 FLUIGIP.USEFUL.showInfo(msg);
				 }
			}
		},

		/**
		 * Função removeLineTable
		 * @description Remove a linha especificada da sua tabela. Antes de remover a linha, esse método chama a função beforeRemoveLineTable_PE(table, id) caso exista no seu código javascript. Após a remoção da mesma, o método chama a função removeLineTable_PE(table, id).
		 * @memberof TABLE
		 * @param {*} oElement Elemento de referência da linha a ser acionado, como por exemplo um ícone, ou a referencia da própria linha. Ex: $("campo___1").
		 * @example FLUIGIP.TABLE.removeLineTable(oElement);
		 * @example TABLE, deletar, tabela, linhas
		 * @example 
		 * @author
		 */
		//FIXME: Não testado
		removeLineTable: function(oElement){
			var table = $(oElement).closest("table").attr("id");
			var id = $(oElement).closest("tr").find("td > input").attr("id").split("___")[1];
			if (typeof window["beforeRemoveLineTable_PE"] === "function"){
				window["beforeRemoveLineTable_PE"](table, id);
			}
			fnWdkRemoveChild(oElement);
			if (typeof window["removeLineTable_PE"] === "function"){
				window["removeLineTable_PE"](table, id);
			}
		},

		/**
		 * Função addTable
		 * @description Adiciona um filho à tabela pai x filho.  Após adicionar o filho à tabela pai x filho , o método chama a função addTable_PE(table, id)
		 * @deprecated addTableChild
		 * @memberof TABLE
		 * @param {string} table tableName da tabela
		 * @returns {string} Retorna o id do filho
		 * @example FLUIGIP.TABLE.addTable(table);
		 * @example TABLE, adicionar, tabela
		 * @example 
		 * @author
		 */
		//FIXME: Não testado
		addTable: function(table){
			var id = wdkAddChild(table);
			//FLUIGC.switcher.initAll('body');
			$("#id"+table).val(id);
			if (typeof window["addTable_PE"] === "function"){
				window["addTable_PE"](table, id);
			}
			return id;
		},
		/**
		 * Função addTableChild
		 * @description Adiciona um filho à tabela pai x filho.  Após adicionar o filho à tabela pai x filho , o método chama a função addTableChild_PE(table, id)
		 * @memberof TABLE
		 * @param {*} table tableName da tabela
		 * @example FLUIGIP.TABLE.addTableChild(table);
		 * @example TABLE, adicionar, tabela
		 * @example 
		 * @author
		 */
		//FIXME: Não testado
		addTableChild: function(table){
			var id = wdkAddChild(table);
			//FLUIGC.switcher.initAll('body');
			$("#id"+table).val(id);
			if (typeof window["addTableChild_PE"] === "function"){
				window["addTableChild_PE"](table, id);
			}
			return id;
		}
	}

	//Propriedade USEFUL
     
	this.USEFUL = {
		//Função que retorna true caso valor seja 0, uso interno apenas
		validFloatValue: function(value){
			
			var valid = false;
			
			// is a number
			if (!isNaN(FLUIGIP.USEFUL.replaceAll(value,',',''))) {
				valid = FLUIGIP.USEFUL.getFloatValue(value) == 0;
			}
			
			return valid;
		},

		/**
		 * Função retiraAcentos
		 * @description Remove todos os acentos encontrados na string informada
		 * @memberof USEFUL
		 * @param {string} str String a ser alterada
		 * @returns {string} String sem acentos
		 * @example nomeSemAcentos = FLUIGIP.USEFUL.retiraAcentos(nome);
		 * @example USEFUL, string, alteração
		 * @example 
		 * @author
		 */
		retiraAcentos: function(str){
			var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
		    var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
		    var novastr="";
		    for(i=0; i<str.length; i++) {
		        troca=false;
		        for (a=0; a<com_acento.length; a++) {
		            if (str.substr(i,1)==com_acento.substr(a,1)) {
		                novastr+=sem_acento.substr(a,1);
		                troca=true;
		                break;
		            }
		        }
		        if (troca==false) {
		            novastr+=str.substr(i,1);
		        }
		    }
		    return novastr;
		},

		/**
		 * Função empty
		 * @description Verifica se o elemento está vazio
		 * @memberof USEFUL
		 * @deprecated isEmpty
		 * @param {*} element Elemento a ser verificado
		 * @returns {boolean} Retorna true ou false
		 * @example estaVazia = FLUIGIP.USEFUL.empty(data);
		 * @example USEFUL, validação, válido, vazio, verificação
		 * @example 
		 * @author
		 */

		empty: function(element){
			if (!FLUIGIP.USEFUL.isNull(element)) {
				if (typeof element === 'string') {
					return ( element == '' );
				} else if (typeof element === 'number') {
					return ( element <= 0 );
				} else if (Array.isArray(element)) {
					return ( element.length == 0 );
				} else {
					return false;
				}
			}
		},
		/**
		 * Função isEmpty
		 * @description Verifica se o elemento está vazio
		 * @memberof USEFUL
		 * @param {string} element Elemento a ser verificado
		 * @returns {boolean} Retorna true ou false
		 * @example estaVazia = FLUIGIP.USEFUL.isEmpty(data);
		 * @example USEFUL, validação, válido, vazio, verificação
		 * @example 
		 * @author
		 */

		 isEmpty: function(element){
			if (!FLUIGIP.USEFUL.isNull(element)) {
				if (typeof element === 'string') {
					return ( element == '' );
				} else if (typeof element === 'number') {
					return ( element <= 0 );
				} else if (Array.isArray(element)) {
					return ( element.length == 0 );
				} else {
					return false;
				}
			}
		},

		/**
		 * Função isNull
		 * @description Verifica se a variável informada é nula
		 * @memberof USEFUL
		 * @param {*} variable Variável a ser verificada
		 * @returns {boolean}  Retorna True ou False
		 * @example resposta = FLUIGIP.USEFUL.isNull(variavel);
		 * @example USEFUL, verificação
		 * @example 
		 * @author
		 */
		isNull: function(variable){
			return (variable == null || variable == undefined)
		},

		/**
		 * Função setValueDisableField
		 * @description Atribui o valor ao campo e muda seu status para readOnly, não permitindo edições.
		 * @memberof USEFUL
		 * @param {string} fieldName Name do campo
		 * @param {*} value Valor a ser atribuido ao campo
		 * @example FLUIGIP.USEFUL.setValueDisableField("telefone", "12 1234-5678");
		 * @example USEFUL, alteração, readOnly
		 * @example 
		 * @author
		 */
		setValueDisableField: function(fieldName, value) {
			FLUIGIP.setWriteFieldByClass(fieldName);
			$(fieldName).val(value);
			FLUIGIP.setReadOnly(fieldName);
		},

		/**
		 * Função getDate
		 * @description Retorna a data atual, formatada no padrão dd/mm/YYYY.
		 * @memberof USEFUL
		 * @returns {string} Retorna a data atual (dd/mm/YYYY)
		 * @example dataAtual = FLUIGIP.USEFUL.getDate();
		 * @example USEFUL, data, get, formatação
		 * @example 
		 * @author
		 */
		getDate: function(){
			var currentTime 	= new Date();
			var month 			= currentTime.getMonth() + 1;
			var day 			= currentTime.getDate();
			var year 			= currentTime.getFullYear();
	
			str_dia = new String(day);
			str_mes = new String(month);
	
			if (str_dia.length < 2)
			str_dia = 0 + str_dia;
			if (str_mes.length < 2)
			str_mes = 0 + str_mes;
	
			return str_dia+"/"+str_mes+"/"+year;
		},

		/**
		 * Função getTime
		 * @description Retorna a hora atual, formatada no padrão hh:mm:ss.
		 * @memberof USEFUL
		 * @returns {string} Retorna a hora formatada (hh:mm:ss) 
		 * @example horaAtual = FLUIGIP.USEFUL.getTime();
		 * @example USEFUL, hora, get, formatação
		 * @example 
		 * @author
		 */
		getTime: function(){
			var data = new Date();
	
			//obtem as horas, minutos e segundos
			var hour = data.getHours();
			var minutes = data.getMinutes();
			var seconds = data.getSeconds();
	
			//converte as horas, minutos e segundos para string
			str_hours = new String(hour);
			str_minutes = new String(minutes);
			str_seconds = new String(seconds);
	
			//se tiver menos que 2 digitos, acrescenta o 0
			if (str_hours.length < 2)
				str_hours = 0 + str_hours;
			if (str_minutes.length < 2)
				str_minutes = 0 + str_minutes;
			if (str_seconds.length < 2)
				str_seconds = 0 + str_seconds;
	
			return str_hours + ':' + str_minutes + ':' + str_seconds;
		},

		/**
		 * Função mValor
		 * @description Não permite o uso de caracteres não numéricos e adiciona . a cada 3 zeros e , para os 2 decimais (ex. 1.000,00). Utilize quando quiser obrigar o usuário a informar apenas números em um campo monetário.
		 * @memberof USEFUL
		 * @param {string} valor Valor a ser padronizado
		 * @returns {string} Valor com o novo padrão
		 * @example retorno = FLUIGIP.USEFUL.mValor(valor);
		 * @example USEFUL, formatação, regex, verificação, números
		 * @example pdevip/resources/assets/images/doc/mValor.gif
		 * @author
		 */
		mValor: function(valor){
			valor=valor.replace(/\D/g,"");
			valor=valor.replace(/(\d)(\d{8})$/,"$1.$2");
			valor=valor.replace(/(\d)(\d{5})$/,"$1.$2");
			valor=valor.replace(/(\d)(\d{2})$/,"$1,$2");
			return valor;
		},
		/**
		 * Função mInt
		 * @description Não permite o uso de caracteres não numéricos e adiciona '.' a cada 3 zeros. Utilize quando quiser obrigar o usuário a informar apenas números no campo.
		 * @memberof USEFUL
		 * @param {string} valor String a ser padronizada
		 * @returns {string} String com o novo padrão
		 * @example retorno = FLUIGIP.USEFUL.mInt(valor);
		 * @example USEFUL, formatação, regex, verificação, números,
		 * @example pdevip/resources/assets/images/doc/mInt.gif
		 * @author
		*/
		mInt: function(valor){
			valor=valor.replace(/[^0-9]+/g,'');
			valor=valor.replace(/(\d)(\d{9})$/,"$1.$2");
			valor=valor.replace(/(\d)(\d{6})$/,"$1.$2");
			valor=valor.replace(/(\d)(\d{3})$/,"$1.$2");
			return valor;
		},

		/**
		 * Função mNumerico
		 * @description Não permite o uso de caracteres não numéricos. Utilize quando quiser obrigar o usuário a informar apenas números no campo.
		 * @memberof USEFUL
		 * @param {string} valor String a ser padronizada
		 * @returns {string} String a ser padronizada
		 * @example retorno = FLUIGIP.USEFUL.mNumerico(valor);
		 * @example USEFUL, formatação, regex, verificação, números, int
		 * @example pdevip/resources/assets/images/doc/mNumerico.gif
		 * @author
		 */
		mNumerico: function(valor){
			valor=valor.replace(/[^0-9]+/g,'');
			return valor;
		},

		

		/**
		 * Função mChar
		 * @description Aplica padrão de caracteres na string (^a-z,A-z,à-ú,À-Ú). Utilize quando quiser obrigar o usuário a informar apenas letras no campo.
		 * @memberof USEFUL
		 * @param {string} valor String a ser padronizada
		 * @returns {string} String com o novo padrão
		 * @example retorno = FLUIGIP.USEFUL.mChar(valor);
		 * @example USEFUL, formatação, regex, verificação, caracteres
		 * @example pdevip/resources/assets/images/doc/mChar.gif
		 * @author
		 */
		mChar: function(valor){
			valor=valor.replace(/[^a-z,A-z,à-ú,À-Ú]+/g,'');
			return valor;
		},

		/**
		 * Função mAlfanum
		 * @description Aplica padrão alfanumérico  na string (^a-z,A-z,0-9). Utilize quando quiser obrigar o usuário a informar apenas letras e números no campo.
		 * @memberof USEFUL
		 * @param {string} valor String a ser padronizada
		 * @returns {string} String com o novo padrão
		 * @example retorno = FLUIGIP.USEFUL.mAlfanum(valor);
		 * @example USEFUL, formatação, regex, verificação, números, caracteres
		 * @example pdevip/resources/assets/images/doc/mAlfanum.gif
		 * @author
		 */
		mAlfanum: function(valor){
			valor=valor.replace(/[^a-z,A-z,0-9]+/g,'');
			return valor;
		},

		/**
		 * Função stringToDate
		 * @description Converte uma variável do tipo string em tipo data
		 * @memberof USEFUL
		 * @param {string} data String a ser convertida
		 * @returns {date} variável do tipo data	
		 * @example dataInicial = FLUIGIP.USEFUL.stringToDate('01/01/2000');
		 * @example USEFUL, conversão, string, date
		 * @example 
		 * @author 
		 */
		stringToDate: function(data){
			data = data.split('/').reverse().join('/');
			var data = new Date((new Date(data)).setHours(0, 0, 0, 0));
			return data;
		},
		
		/**
		 * Função dateToString
		 * @description Converte uma variável do tipo data em tipo string
		 * @memberof USEFUL
		 * @param {date} data Data a ser convertida
		 * @param {string} locale Região da data a ser formatada. Default "pt-BR". (opcional)
		 * @returns {string} Variável do tipo string 	
		 * @example FLUIGIP.USEFUL.dateToString(data);
		 * @example USEFUL, conversão, string, date
		 * @example 
		 * @author Alisson Hausmann
		 */
		dateToString: function(data, locale){
			if(locale == undefined){
				locale = "pt-BR";
			}
			return data.toLocaleDateString(locale);
		},

		/**
		 * Função getStringValue
		 * @description Converte a variável do tipo float em string, limitando as casas decimais de acordo com o valor informado.
		 * @memberof USEFUL
		 * @param {float} float Variável a ser convertida
		 * @param {int} decimal Número de casas decimais a serem preservadas
		 * @returns {string} string contendo o valor convertido
		 * @example precoFinal = FLUIGIP.USEFUL.getStringValue(float, 2);
		 * @example USEFUL, conversão, string, float
		 * @example 
		 * @author
		 */
		getStringValue: function(float,decimal) {
			if(float == ""){
				float = 0;
			}
			decimal  = (typeof decimal !== 'undefined') ? decimal : 2;
			return float.toLocaleString("pt-BR", {minimumFractionDigits: decimal, maximumFractionDigits: decimal});
		},

		/**
		 * Função getFloatValue
		 * @description Converte uma string em float
		 * @memberof USEFUL
		 * @param {string} string String a ser convertida
		 * @returns {float} Float obtido após a conversão 
		 * @example float = FLUIGIP.USEFUL.getFloatValue(valor);
		 * @example USEFUL, conversão, string, float
		 * @example 
		 * @author
		 */
		getFloatValue: function(string) {
			if(string == ""){
				string = "0"
			}
			string = FLUIGIP.USEFUL.replaceAll(string, ".", "");
			string = FLUIGIP.USEFUL.replaceAll(string, ",", ".");
			return parseFloat(string);
		},

		/**
		 * Função replaceAll
		 * @description Altera a string informada, de acordo com os parâmetros 
		 * @memberof USEFUL
		 * @param {string} string String original
		 * @param {string} fromValue Valor a ser substituído
		 * @param {string} toValue Valor a substituir
		 * @returns {string} String modificada
		 * @example novaString = FLUIGIP.USEFUL.replaceAll(stringOriginal, fromValue, toValue);
		 * @example USEFUL, alteração, string
		 * @example 
		 * @author
		 */
		replaceAll: function(string, fromValue, toValue){
			if (typeof string == "string") {
				while (string.indexOf(fromValue) != -1) {
					string = string.replace(fromValue, toValue);
				}
				return string;
			} else {
				console.log("argument 'string' on replaceAll is not a string")
				return null;
			}
		},

		/**
		 * Função getIdChild
		 * @description Retorna o ID de uma linha do pai x filho
		 * @memberof USEFUL
		 * @param {string} name Name da linha
		 * @returns {string} Id da linha
		 * @example idLinha = FLUIGIP.USEFUL.getIdChild(nome);
		 * @example USEFUL, get
		 * @example 
		 * @author
		 */
		//FIXME: Não testado
		getIdChild: function(name){
			var comp =  name.split("___");
			if (comp.length  == 1){
				return "0";
			}else{
				return comp[1];
			}
		},

		/**
		 * Função showError
		 * @description Exibe a mensagem de erro em um toast
		 * @memberof USEFUL
		 * @param {string} msg Mensagem a ser exibida
		 * @example FLUIGIP.USEFUL.showError(mensagem);
		 * @example USEFUL, mensagem, erro, toast
		 * @example pdevip/resources/assets/images/doc/showError.PNG
		 * @author
		 */
		showError: function(msg) {
			FLUIGC.toast({ title: 'Erro:', message: msg, type: 'danger' });
		},
		/**
		 * Função showSuccess
		 * @description Exibe a mensagem de sucesso em um toast
		 * @memberof USEFUL
		 * @param {string} msg Mensagem a ser exibida
		 * @example FLUIGIP.USEFUL.showSuccess(mensagem);
		 * @example USEFUL, mensagem, sucesso, toast
		 * @example pdevip/resources/assets/images/doc/showSuccess.JPG
		 * @author Andressa Oliveira
		 */
		showSuccess: function(msg) {
			FLUIGC.toast({ title: 'Sucesso:', message: msg, type: 'success' });
		},

		/**
		 * Função showWarning
		 * @description Exibe mensagem do tipo warning em um toast
		 * @memberof USEFUL
		 * @param {string} msg Mensagem a ser exibida
		 * @example FLUIGIP.USEFUL.showWarning(mensagem);
		 * @example USEFUL, mensagem, warning, toast
		 * @example pdevip/resources/assets/images/doc/showWarning.PNG
		 * @author
		 */
		showWarning: function(msg) {
			FLUIGC.toast({ title: 'Aviso:', message: msg, type: 'warning' });
		},

		/**
		 * Função showInfo
		 * @description Exibe mensagem do tipo info em um toast
		 * @memberof USEFUL
		 * @param {string} msg Mensagem a ser exibida
		 * @example FLUIGIP.USEFUL.showInfo(mensagem);
		 * @example USEFUL, mensagem, info, toast
		 * @example pdevip/resources/assets/images/doc/showInfo.PNG
		 * @author
		 */
		showInfo: function(msg) {
			FLUIGC.toast({ title: 'Informa&ccedil;&atilde;o:', message: msg, type: 'info' });
		},

		/**
		 * Função showMessage
		 * @description Exibe mensagem personalizada em um toast
		 * @memberof USEFUL
		 * @param {string} msg Mensagem a ser exibida
		 * @param {string} title Título da mensagem
		 * @param {string} label Texto do botão
		 * @example FLUIGIP.USEFUL.showMessage(mensagem, titulo, textoBotao);
		 * @example USEFUL, mensagem, toast
		 * @example pdevip/resources/assets/images/doc/showMessage.PNG
		 * @author
		 */
		showMessage: function(msg, title, label) {
			message = typeof msg !== 'undefined' ? msg : "";
			title = typeof title !== 'undefined' ? title : "Alert";
			label = typeof label !== 'undefined' ? label : "OK";
			FLUIGC.message.alert({
				message: msg,
				title: title,
				label: label
			});
		},

		/**
		 * Função clearFields
		 * @description Ao limpar o campo de referência, limpa todos os campos que possuam a classe ou o id informado
		 * @memberof USEFUL
		 * @param {string} fieldId id do campo de referência
		 * @param {string} selector classe ou id dos campos a serem limpos
		 * @example FLUIGIP.USEFUL.clearFields("#cep",".endereco"); FLUIGIP.USEFUL.clearFields("#cidade","#UF");
		 * @example USEFUL, limpa, campos, classe, id
		 * @example 
		 * @author Andressa Oliveira
		 */
		clearFields: function(fieldId, selector) {
			//quando o usuário 'soltar' uma tecla no campo de referência
			$(fieldId).keyup(function() {
				//se nao houver um valor no campo
				if (!this.value) {
					//para cada item que possua o seletor informado
					$(selector).each(function () {
						//limpa o campo
						$(selector).val('');
						$(selector).prop('checked', false);
						$(selector).removeAttr('selected');
					});	
				}
			}
		)},
		/**
		 * Função setDateRange
		 * @description Habilita um calendário com um espaço de datas pré-definido para seleção, ou seja, o usuário só poderá escolher uma data que esteja entre a data mínima e a data máxima definida. Esse método recebe 3 parâmetros: a data de referência, a quantidade de dias anteriores a referência e a quantidade de dias posteriores à mesma.
		 * @memberof USEFUL
		 * @param {string} calendarId id do campo de referência
		 * @param {string} initialDate id do campo de referência
		 * @param {string} daysBefore classe ou id dos campos a serem limpos
		 * @param {string} daysAfter classe ou id dos campos a serem limpos
		 * @example FLUIGIP.USEFUL.setDateRange("#meu-calendario","05/03/2020", 2, 10);
		 * @example USEFUL, calendário, range, datas, data inicial, data final, seleção
		 * @example 
		 * @author Andressa Oliveira
		 */
		setDateRange: function(calendarVar, initialDate, daysBefore, daysAfter) {
			var dataInicial, dataFinal;
			//validações
			if (FLUIGIP.USEFUL.isNull(daysBefore)) daysBefore = 0;
			if (FLUIGIP.USEFUL.isNull(daysAfter)) daysAfter = 0;
			if (FLUIGIP.USEFUL.isNull(initialDate)) {
				initialDate = new Date();
				dataInicial = initialDate;
				dataFinal = initialDate;
				
			}else{
				dataInicial = FLUIGIP.USEFUL.stringToDate(initialDate);
				dataFinal = FLUIGIP.USEFUL.stringToDate(initialDate);

			}
			
			//atribui a data de referencia pra início e fim
			dataInicial = dataInicial.setDate(dataInicial.getDate() - daysBefore);
			dataFinal = dataFinal.setDate(dataFinal.getDate() + daysAfter);
			calendarVar.setDate(initialDate);
			calendarVar.setMinDate(new Date(dataInicial));
			calendarVar.setMaxDate(new Date(dataFinal));
			}
	}
	

	//Propriedade VALID
	this.VALID = {

		/**
		 * Função validateForm
		 * @description Verifica se cada campo obrigatório foi preenchido, caso não tenha sido, retorna um vetor (false, "mensagem de erro"). Por padrão, o método é chamado automaticamente pelo método beforeSendValidate.
		 * @memberof VALID
		 * @returns {array} Vetor (éValido, mensagem)
		 * @example FLUIGIP.VALID.validateForm();
		 * @example VALID, validação, mensagem, erro
		 * @example 
		 * @author
		 */
		//FIXME: Não testado
		validateForm: function(){
			var obj = this;
			var isValidate = true;
			var messageAll = "Preencha os campos em vermelho.";
			var messageVld = "";
			var result =  [];
	
			$(".has-error").removeClass("has-error");
			$(".has-error-table").removeClass("has-error-table");
	
			$("input,select,textarea").each(function(){
				//var states;
				var required;
				var conditional;
	
				if ($(this).attr("type") == "zoom"){
					required 	= $(this).parent("div").data("fluig-required");
					//states   	= $(this).parent("div").data("fluig-state-valid");
					conditional = $(this).parent("div").data("fluig-conditional-valid");
				} else if($(this).attr("type") == "radio"){
					required 	= $(this).parent("label").parent("div").data("fluig-required");
					//states   	= $(this).parent("label").parent("div").data("fluig-state-valid");
					conditional = $(this).parent("label").parent("div").data("fluig-conditional-valid");
				} else if($(this).attr("type") == "checkbox"){
					required 	= $(this).closest(".input-group").data("fluig-required");
					//states   	= $(this).closest(".input-group").data("fluig-state-valid");
					conditional = $(this).closest(".input-group").data("fluig-conditional-valid");
				} else {
					required 	=  $(this).data("fluig-required");
					//states   	=  $(this).data("fluig-state-valid");
					conditional =  $(this).data("fluig-conditional-valid");
				}
				var value    =  ($("#"+$(this).attr("id")).val() == null ? "" : $("#"+$(this).attr("id")).val().toString());
	
				var keep = FLUIGIP.validConditional(conditional);
				var validConditional = keep ? eval(conditional) : true ;
	
				//if ( (typeof required != 'undefined') && (typeof states != 'undefined') && (validConditional) ){
				if ( (typeof required != 'undefined') && (validConditional) ){
	
					/*states = (typeof states == "number" ? states.toString()  : states);
					states = states.split(",");*/
	
					//if ( eval(required) && (states.indexOf(getWKNumState()) != -1  || states.indexOf("*") != -1) ) {
					if ( eval(required) ) {
	
						if ( value.trim() == "" || value =='undefined' || value == null || FLUIGIP.USEFUL.validFloatValue(value) ){
	
							if (!($(this).closest('table').length > 0 && $(this).attr('id').indexOf('___') == -1 )){
								messageVld += "\n"
								isValidate = false;
	
								if ($(this).attr("type") == "zoom"){
									$(this).parent("div").addClass("has-error");
									$(this).parent("div").find("span[role='combobox']").addClass("has-error-table");
								} else if ($(this).closest('.input-group').length > 0) {
									if ($(this).attr("id").indexOf("___") != -1){
										$(this).addClass("has-error-table");
									} else {
										$(this).closest(".input-group").parent("div").addClass("has-error");
									}
								} else {
									if ($(this).attr("id").indexOf("___") != -1){
										$(this).addClass("has-error-table");
									} else {
										$(this).parent("div").addClass("has-error");
									}
								}
							}
						} else if($(this).attr("type") == "radio"){
							if ($('input:radio[name='+this.name+']:checked').val() == "" || $('input:radio[name='+this.name+']:checked').val() =='undefined'  || $('input:radio[name='+this.name+']:checked').val() == null){
								messageVld += "\n"
								isValidate = false;
								$(this).parent("label").parent("div").parent("div").addClass("has-error");
								//console.log(this);
							}
						} else if($(this).attr("type") == "checkbox"){
							if (!$(this).prop("checked")){
								messageVld += "\n"
								isValidate = false;
								$(this).closest(".input-group").parent("div").addClass("has-error");
								//console.log(this);
							}
						}
					}
				}
			});
	
			$("table").each(function(){
				var states;
				var required;
	
				//states   =  $(this).data("fluig-table-states-required");
				required = true;
	
				if (typeof states != 'undefined'){
	
					states = (typeof states == "number" ? states.toString()  : states);
					states = states.split(",");
	
					if( eval(required) && (states.indexOf(getWKNumState()) != -1  || states.indexOf("*") != -1) ) {
						if (!obj.validateGrid($(this).attr("id"))){
							$(this).closest("div").addClass("has-error-table");
							messageVld += "Tabela "+$(this).attr("id")+" não foi preenchida\n";
							isValidate = false;
						}
					}
				}
			});
	
			if (messageVld =="" ){
				isValidate = true;
			}
			result.push(isValidate)
			result.push(messageAll)
			return result;
		},

		/**
		 * Função validateGrid
		 * @description Verifica se a tabela possui linhas
		 * @memberof VALID
		 * @param {string} idTablePaiFilho Id da tabela
		 * @returns {boolean}  Retorna True ou False
		 * @example temLinhas = FLUIGIP.VALID.validateGrid('tabela');
		 * @example VALID, verificação, tabela, linhas
		 * @example 
		 * @author
		 */
		validateGrid:  function(idTablePaiFilho){
			var tableLength = $("#"+idTablePaiFilho+" tbody tr").length;
			if (tableLength <= 1){
				return false
			}else{
				return true;
			}
		},

		/**
		 * Função validDuplicateValueGrid
		 * @description Verifica se o valor passado já existe na tabela. Caso exista, retorna true, caso contrário, retorna false.
		 * @deprecated isDuplicatedOnGrid
		 * @memberof VALID
		 * @param {string} idTable Id da tabela
		 * @param {string} idField Id do campo
		 * @param {string} value Valor a ser comparado
		 * @returns {boolean} True ou false
		 * @example eDuplicado = FLUIGIP.VALID.validDuplicateValueGrid("tabelaClientes", "nomeCliente", "Maria"));
		 * @example VALID, validação, verificação, tabela, grid
		 * @example 
		 * @author
		 * 
		 */
		validDuplicateValueGrid: function(idTable, idField, value){
	
			var itens = FLUIGIP.TABLE.getTableSize(idTable);
			var count = 0;
			var retorno = false;
			var valor = "";
			if (!FLUIGIP.USEFUL.isNull(value)) {
				for (var i = 1; i <= itens; i++) {
					valor = (FLUIGIP.USEFUL.isNull(document.getElementById(idField+"___"+i))) ? "" : document.getElementById(idField+"___"+i).value;
					
					if (valor == value) {
						count++;
					}
					if (count > 1) {
						retorno = true;
						break;
					}
					
				}
			}
			return retorno;
		},
		/**
		 * Função isDuplicatedOnGrid
		 * @description Verifica se o valor passado já existe na tabela. Caso exista, retorna true, caso contrário, retorna false.
		 * @memberof VALID
		 * @param {string} idTable Id da tabela
		 * @param {string} idField Id do campo
		 * @param {string} value Valor a ser comparado
		 * @returns {boolean} True ou false
		 * @example eDuplicado = FLUIGIP.VALID.isDuplicatedOnGrid("tabelaClientes", "nomeCliente", "Maria"));
		 * @example VALID, validação, verificação, tabela, grid
		 * @example  
		 * @author
		 * 
		 */
		isDuplicatedOnGrid: function(idTable, idField, value){
			var count = 0;
			var retorno = false;
			var valor = "";
			if (!FLUIGIP.USEFUL.isNull(value)) {
				$("#"+idTable+" tbody tr").each(function(){
					var id = FLUIGIP.USEFUL.getIdChild($(this).find("input:first").attr("name"));
					if(id > 0){
						valor = (FLUIGIP.USEFUL.isNull(document.getElementById(idField+"___"+id))) ? "" : document.getElementById(idField+"___"+id).value;
						if (valor == value) {
							count++;
						}
						if (count > 1) {
							retorno = true;
						}
					}
				});
			}
			return retorno;
		}
	}
	// Propriedade ZOOM
     
	this.ZOOM = {
		/**
		 * Função setZoomData
		 * @description Atribui o valor informado ao campo zoom
		 * @memberof ZOOM
		 * @param {string} instance Id do campo zoom
		 * @param {string} value Valor
		 * @example FLUIGIP.ZOOM.setZoomData(instancia, valor);
		 * @example ZOOM, alteração
		 * @example  
		 * @author
		 */
		//FIXME: Não testado
		setZoomData: function(instance, value){
			if (typeof window[instance] != "undefined") {
				window[instance].setValue(value);
			} else {
				console.log( instance+" not found");
			}
		},
		/**
		 * Função setZoomReadonly
		 * @description Altera a propriedade "readOnly" ao campo zoom, de acordo com os parâmetros passados: true ou false. 
		 * @memberof ZOOM
		 * @param {string} instance Id do campo zoom
		 * @param {boolean} value True ou false
		 * @example FLUIGIP.ZOOM.setZoomReadonly(instancia, true);
		 * @example ZOOM, alteração, readOnly
		 * @example  
		 * @author
		 */
		//FIXME: Não testado
		setZoomReadonly: function(instance, value){
			if (typeof window[instance] != "undefined") {
				window[instance].disable(value);
			} else {
				console.log( instance+" not found");
			}
		},
		/**
		 * Função removeItemZoom
		 * @description Remove o item informado do campo tipo zoom
		 * @memberof ZOOM
		 * @param {string} instance  Id do campo tipo zoom
		 * @example FLUIGIP.ZOOM.removeItemZoom(instancia);
		 * @example ZOOM, deletar
		 * @example  
		 * @author
		 */
		//FIXME: Não testado
		removeItemZoom: function(instance){
			if (typeof window[instance] != "undefined") {
				window[instance].clear();
			} else {
				console.log( instance+" not found");
			}
		}
	}
}


//FUNCOES AUXILIARES

/**
 * Função beforeSendValidate
 * @description Valida o formulário antes do envio (chamada automaticamente pelo Fluig ao enviar um form). Antes de validar o formulário, esse método chama a função beforeValidateForm_PE(numState, nextState) e antes de efetuar o envio do form chama a função beforeSendValidate_PE(numState,nextState).
 * @memberof FLUIGIP
 * @param {int} numState Atividade atual
 * @param {int} nextState Próxima atividade
 * @example beforeSendValidate(numState, nextState);
 * @example FLUIGIP, validação, verificação
 * @example
 * @author
 */

//FIXME: Não testado

var beforeSendValidate = function(/*numState, nextState*/) {
    /*console.log("numState: " + numState);
    console.log("nextState: " + nextState);*/

    /*if (typeof window["beforeValidateForm_PE"] === "function")
   		window["beforeValidateForm_PE"](numState, nextState);*/

	var isOK = true;
	var validFields = FLUIGIP.VALID.validateForm()
	isOK = validFields[0];
	if ( !isOK ){
		//throw validFields[1];
		FLUIGIP.USEFUL.showError(validFields[1]);
	} /*else {
	    if (typeof window["beforeSendValidate_PE"] === "function"){
	    	var retPE = window["beforeSendValidate_PE"](numState,nextState);

	    	if (!typeof retPE === "boolean"){
	    		throw "beforeSendValidade_PE sem retorno logico.";

	    		isOK = false;
	    	} else {
	    		isOK = retPE;
	    	}
	    }
	}*/

	return isOK;
}

//Função de início
$(document).on("ready", function() {
	//console.log("Atividade " + getWKNumState());
	
	FLUIGIP.setReadOnly(".form-control");
	//FLUIGIP.setReadOnlyByStates();
	FLUIGIP.setHideElementsByStates();
	FLUIGIP.setLabelRequiredByStates();

	FLUIGIP.removeAlertValidation();
	FLUIGIP.updCalendar();
	
	FLUIGIP.writeForState();
	FLUIGIP.setWriteFieldByState();

	/*if(getFormMode() != "VIEW") {
		FLUIGIP.writeForState();
		FLUIGIP.setWriteFieldByState();
	}*/

	$("input:checkbox").each(function(){
		var idchk = '#' + $(this).attr("id");
		//FLUIGC.switcher.init(idchk);
		//FLUIGC.switcher.onChange(idchk, function(event, state){
		//	$(idchk).closest(".input-group").parent("div").removeClass("has-error");
		//});
	});
	
	$(document).on('change', ".retiraAcentos", function () {
		$(this).val(FLUIGIP.USEFUL.retiraAcentos($(this).val()));
	});
	
	$(document).on('blur', ".retiraAcentos", function () {
		$(this).val(FLUIGIP.USEFUL.retiraAcentos($(this).val()));
	});

	$(document).on('keyup', '.mChar',function(){
		var valor = FLUIGIP.USEFUL.mChar($(this).val());
		$(this).val(valor);
	});
	$(document).on('blur', '.mChar',function(){
		var valor = FLUIGIP.USEFUL.mChar($(this).val());
		$(this).val(valor);
	});

	$(document).on('keyup', '.mAlfanum',function(){
		var valor = FLUIGIP.USEFUL.mAlfanum($(this).val());
		$(this).val(valor);
	});

	$(document).on('blur', '.mAlfanum',function(){
		var valor = FLUIGIP.USEFUL.mAlfanum($(this).val());
		$(this).val(valor);
	});

	$(document).on('keyup', '.mInt',function(){
		var valor = FLUIGIP.USEFUL.mInt($(this).val());
		$(this).val(valor);
	});

	$(document).on('blur', '.mInt',function(){
		var valor2 = 0;
		var valor  = $(this).val();
		valor  = FLUIGIP.USEFUL.replaceAll(valor,'.','');
		valor2 = parseInt(valor);
		valor  = FLUIGIP.USEFUL.mInt(valor2.toString());
		$(this).val(valor);
	});

	$(document).on('keyup', '.mValor',function(){
		var valor = FLUIGIP.USEFUL.mValor($(this).val());
		var tam	= $(this).attr("maxlength");
		var pontos = 0;
		$(this).val(valor);
		if(tam != "undefined"){
			if ($(this).val().length > tam){
				valor = valor.replace(/\D/g,"");
				if(tam > 9 ){
					pontos = 3;
				}else if (tam >6){
					pontos = 2;
				}else{
					pontos = 1;
				}
				valor = FLUIGIP.USEFUL.mValor(valor.substr(0,$(this).attr("maxlength")-pontos));
				$(this).val(valor)
			}
		}
	});
	$(document).on('blur', '.mValor',function(){
		var valor = FLUIGIP.USEFUL.mValor($(this).val());
		$(this).val(valor);
	});

	$(document).on('keyup', '.mNumerico',function(){
		var valor = FLUIGIP.USEFUL.mNumerico($(this).val());
		$(this).val(valor);
	});

	$(document).on('blur', '.mNumerico',function(){
		var valor = FLUIGIP.USEFUL.mNumerico($(this).val());
		$(this).val(valor);
	});
	$(document).on('click', '.clickable',function(){
		$(this).find("input").first().focus();
	});
	$(".clickable").each(function(){
		teste = $(this).find("input").first() ;
		$(this).html( teste[0].innerHTML + "<div class='input-group-addon'><span class='fluigicon-calendar fluigicon'></span></div>" );
	});
	
	$(document).on('keypress', ".zoom-tdi", function (e) {
		if (e.which == 13 || e.keyCode == 11) {
			$(this).next().click();
		}
	});

});


/*
* jQuery Mask Plugin v1.14.13
* github.com/igorescobar/jQuery-Mask-Plugin
* http://igorescobar.github.io/jQuery-Mask-Plugin/docs.html
*/
var $jscomp={scope:{},findInternal:function(a,l,d){a instanceof String&&(a=String(a));for(var p=a.length,h=0;h<p;h++){var b=a[h];if(l.call(d,b,h,a))return{i:h,v:b}}return{i:-1,v:void 0}}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,l,d){if(d.get||d.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[l]=d.value)};
$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.polyfill=function(a,l,d,p){if(l){d=$jscomp.global;a=a.split(".");for(p=0;p<a.length-1;p++){var h=a[p];h in d||(d[h]={});d=d[h]}a=a[a.length-1];p=d[a];l=l(p);l!=p&&null!=l&&$jscomp.defineProperty(d,a,{configurable:!0,writable:!0,value:l})}};
$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(a,d){return $jscomp.findInternal(this,a,d).v}},"es6-impl","es3");
(function(a,l,d){"function"===typeof define&&define.amd?define(["jquery"],a):"object"===typeof exports?module.exports=a(require("jquery")):a(l||d)})(function(a){var l=function(b,e,f){var c={invalid:[],getCaret:function(){try{var a,r=0,g=b.get(0),e=document.selection,f=g.selectionStart;if(e&&-1===navigator.appVersion.indexOf("MSIE 10"))a=e.createRange(),a.moveStart("character",-c.val().length),r=a.text.length;else if(f||"0"===f)r=f;return r}catch(C){}},setCaret:function(a){try{if(b.is(":focus")){var c,
g=b.get(0);g.setSelectionRange?g.setSelectionRange(a,a):(c=g.createTextRange(),c.collapse(!0),c.moveEnd("character",a),c.moveStart("character",a),c.select())}}catch(B){}},events:function(){b.on("keydown.mask",function(a){b.data("mask-keycode",a.keyCode||a.which);b.data("mask-previus-value",b.val());b.data("mask-previus-caret-pos",c.getCaret());c.maskDigitPosMapOld=c.maskDigitPosMap}).on(a.jMaskGlobals.useInput?"input.mask":"keyup.mask",c.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){b.keydown().keyup()},
100)}).on("change.mask",function(){b.data("changed",!0)}).on("blur.mask",function(){d===c.val()||b.data("changed")||b.trigger("change");b.data("changed",!1)}).on("blur.mask",function(){d=c.val()}).on("focus.mask",function(b){!0===f.selectOnFocus&&a(b.target).select()}).on("focusout.mask",function(){f.clearIfNotMatch&&!h.test(c.val())&&c.val("")})},getRegexMask:function(){for(var a=[],b,c,f,n,d=0;d<e.length;d++)(b=m.translation[e.charAt(d)])?(c=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),f=b.optional,
(b=b.recursive)?(a.push(e.charAt(d)),n={digit:e.charAt(d),pattern:c}):a.push(f||b?c+"?":c)):a.push(e.charAt(d).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));a=a.join("");n&&(a=a.replace(new RegExp("("+n.digit+"(.*"+n.digit+")?)"),"($1)?").replace(new RegExp(n.digit,"g"),n.pattern));return new RegExp(a)},destroyEvents:function(){b.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(a){var c=b.is("input")?"val":"text";if(0<arguments.length){if(b[c]()!==a)b[c](a);
c=b}else c=b[c]();return c},calculateCaretPosition:function(){var a=b.data("mask-previus-value")||"",e=c.getMasked(),g=c.getCaret();if(a!==e){var f=b.data("mask-previus-caret-pos")||0,e=e.length,d=a.length,m=a=0,h=0,l=0,k;for(k=g;k<e&&c.maskDigitPosMap[k];k++)m++;for(k=g-1;0<=k&&c.maskDigitPosMap[k];k--)a++;for(k=g-1;0<=k;k--)c.maskDigitPosMap[k]&&h++;for(k=f-1;0<=k;k--)c.maskDigitPosMapOld[k]&&l++;g>d?g=10*e:f>=g&&f!==d?c.maskDigitPosMapOld[g]||(f=g,g=g-(l-h)-a,c.maskDigitPosMap[g]&&(g=f)):g>f&&
(g=g+(h-l)+m)}return g},behaviour:function(f){f=f||window.event;c.invalid=[];var e=b.data("mask-keycode");if(-1===a.inArray(e,m.byPassKeys)){var e=c.getMasked(),g=c.getCaret();setTimeout(function(){c.setCaret(c.calculateCaretPosition())},10);c.val(e);c.setCaret(g);return c.callbacks(f)}},getMasked:function(a,b){var g=[],d=void 0===b?c.val():b+"",n=0,h=e.length,q=0,l=d.length,k=1,r="push",p=-1,t=0,y=[],v,z;f.reverse?(r="unshift",k=-1,v=0,n=h-1,q=l-1,z=function(){return-1<n&&-1<q}):(v=h-1,z=function(){return n<
h&&q<l});for(var A;z();){var x=e.charAt(n),w=d.charAt(q),u=m.translation[x];if(u)w.match(u.pattern)?(g[r](w),u.recursive&&(-1===p?p=n:n===v&&n!==p&&(n=p-k),v===p&&(n-=k)),n+=k):w===A?(t--,A=void 0):u.optional?(n+=k,q-=k):u.fallback?(g[r](u.fallback),n+=k,q-=k):c.invalid.push({p:q,v:w,e:u.pattern}),q+=k;else{if(!a)g[r](x);w===x?(y.push(q),q+=k):(A=x,y.push(q+t),t++);n+=k}}d=e.charAt(v);h!==l+1||m.translation[d]||g.push(d);g=g.join("");c.mapMaskdigitPositions(g,y,l);return g},mapMaskdigitPositions:function(a,
b,e){a=f.reverse?a.length-e:0;c.maskDigitPosMap={};for(e=0;e<b.length;e++)c.maskDigitPosMap[b[e]+a]=1},callbacks:function(a){var h=c.val(),g=h!==d,m=[h,a,b,f],q=function(a,b,c){"function"===typeof f[a]&&b&&f[a].apply(this,c)};q("onChange",!0===g,m);q("onKeyPress",!0===g,m);q("onComplete",h.length===e.length,m);q("onInvalid",0<c.invalid.length,[h,a,b,c.invalid,f])}};b=a(b);var m=this,d=c.val(),h;e="function"===typeof e?e(c.val(),void 0,b,f):e;m.mask=e;m.options=f;m.remove=function(){var a=c.getCaret();
c.destroyEvents();c.val(m.getCleanVal());c.setCaret(a);return b};m.getCleanVal=function(){return c.getMasked(!0)};m.getMaskedVal=function(a){return c.getMasked(!1,a)};m.init=function(d){d=d||!1;f=f||{};m.clearIfNotMatch=a.jMaskGlobals.clearIfNotMatch;m.byPassKeys=a.jMaskGlobals.byPassKeys;m.translation=a.extend({},a.jMaskGlobals.translation,f.translation);m=a.extend(!0,{},m,f);h=c.getRegexMask();if(d)c.events(),c.val(c.getMasked());else{f.placeholder&&b.attr("placeholder",f.placeholder);b.data("mask")&&
b.attr("autocomplete","off");d=0;for(var l=!0;d<e.length;d++){var g=m.translation[e.charAt(d)];if(g&&g.recursive){l=!1;break}}l&&b.attr("maxlength",e.length);c.destroyEvents();c.events();d=c.getCaret();c.val(c.getMasked());c.setCaret(d)}};m.init(!b.is("input"))};a.maskWatchers={};var d=function(){var b=a(this),e={},f=b.attr("data-mask");b.attr("data-mask-reverse")&&(e.reverse=!0);b.attr("data-mask-clearifnotmatch")&&(e.clearIfNotMatch=!0);"true"===b.attr("data-mask-selectonfocus")&&(e.selectOnFocus=
!0);if(p(b,f,e))return b.data("mask",new l(this,f,e))},p=function(b,e,f){f=f||{};var c=a(b).data("mask"),d=JSON.stringify;b=a(b).val()||a(b).text();try{return"function"===typeof e&&(e=e(b)),"object"!==typeof c||d(c.options)!==d(f)||c.mask!==e}catch(t){}},h=function(a){var b=document.createElement("div"),d;a="on"+a;d=a in b;d||(b.setAttribute(a,"return;"),d="function"===typeof b[a]);return d};a.fn.mask=function(b,d){d=d||{};var e=this.selector,c=a.jMaskGlobals,h=c.watchInterval,c=d.watchInputs||c.watchInputs,
t=function(){if(p(this,b,d))return a(this).data("mask",new l(this,b,d))};a(this).each(t);e&&""!==e&&c&&(clearInterval(a.maskWatchers[e]),a.maskWatchers[e]=setInterval(function(){a(document).find(e).each(t)},h));return this};a.fn.masked=function(a){return this.data("mask").getMaskedVal(a)};a.fn.unmask=function(){clearInterval(a.maskWatchers[this.selector]);delete a.maskWatchers[this.selector];return this.each(function(){var b=a(this).data("mask");b&&b.remove().removeData("mask")})};a.fn.cleanVal=function(){return this.data("mask").getCleanVal()};
a.applyDataMask=function(b){b=b||a.jMaskGlobals.maskElements;(b instanceof a?b:a(b)).filter(a.jMaskGlobals.dataMaskAttr).each(d)};h={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,useInput:!/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent)&&h("input"),watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},
S:{pattern:/[a-zA-Z]/}}};a.jMaskGlobals=a.jMaskGlobals||{};h=a.jMaskGlobals=a.extend(!0,{},h,a.jMaskGlobals);h.dataMask&&a.applyDataMask();setInterval(function(){a.jMaskGlobals.watchDataMask&&a.applyDataMask()},h.watchInterval)},window.jQuery,window.Zepto);

/*
CSS
*/
$('<style type="text/css"> .required::after {content: "*";color: red;} </style>').appendTo("head");
$('<style type="text/css"> .has-error-table {border: 1px solid #a94442 !important;} </style>').appendTo("head");
$('<style type="text/css"> span.fluig-style-guide.fs-display-block.fs-md-space {padding: 2px 20px !important;} </style>').appendTo("head");



//FIXME: Não testado
var tdizoom = (function () {
	var zoommodal = null;
	var loading = FLUIGC.loading('#loading-zoom');
	return {
		/**
		 * Função open
		 * @description Aplica a personalização criada pela TOTVSIP ao campo do tipo Zoom. Utilize o tdizoom.open para zoom comum e tdizoomCheck.open para zoom com opção de multipla escolha.
		 * @memberof TDIZOOM
		 * @param {*} dataset Dataset a ser consultado
		 * @param {*} fields Campos a serem mostrados
		 * @param {*} resultfields
		 * @param {*} title Título
		 * @param {*} filters Filtros
		 * @param {*} type Tipo
		 * @param {*} likefield likefield
		 * @param {*} likevalue likevalue
		 * @param {*} searchby Pesquisar por
		 * @returns Retorna HTML com o campo zoom personalizado
		 * @example tdizoom.open("nomeDataset", "campoDataset1,nomeColuna1,campoDataset2,nomeColuna2", "campoDataset1,campoDataset3", "Titulo", "filtro,valorfiltro", "nome_do_campo");
		 * @example TDIZOOM, ZOOM
		 * @example
		 * @author 
		 */
		//TODO: Rever descrição, descrever parâmetros e verificar o exemplo
		open: function (dataset, fields, resultfields, title, filters, type, likefield, likevalue, searchby) {

			isHeaderVisible = $("#workflowview-header", window.parent.document).is(":visible");
			isFixedVisible = $(".fixedTopBar", window.parent.document).is(":visible");
			isHeaderHide = null;
			isFixedHide = null;
			if (isHeaderVisible) {
				$("#workflowview-header", window.parent.document).hide();
				isHeaderHide = true;
			}
			if (isFixedVisible) {
				$(".fixedTopBar", window.parent.document).hide();
				isFixedHide = true;
			}


			//alert(window.innerHeight);
			mobile = (typeof mobile !== 'undefined') ? mobile : "false";
			if (mobile == "true") {
				//$("form").hide();
			}

			console.log(likefield)

			loading.show();

			var showfields = [];
			var globaldataset = [];
			var current = 0;

			if (zoommodal != null) {
				zoommodal.remove();
				zoommodal = null;

				$(".table-zoom > thead").html("");
				$(".table-zoom > tbody").html("");
			}

			var html = "<body class='fluig-style-guide' style='z-index:-1'>";
			html += "<div class='input-group'>";
			html += "<span class='input-group-addon'><span class='fluigicon fluigicon-search'></span></span>";
			html += "<input type='text' class='form-control' id='search' value='" + $("#" + type).val() + "' placeholder='Digite o texto e utilize o <Enter> para buscar'>";
			html += "</div>";
			if (typeof miniZoom != "undefined") {
				html += "<div class='' id='loading-zoom' style='overflow-y: auto; height: 120px;'>";
			} else {
				html += "<div class='' id='loading-zoom' style='overflow-y: auto; height: 300px;'>";
			}
			html += "<table  class='table table-hover table-zoom'>";
			html += "<thead>";
			html += "</thead>";
			html += "<tbody>";
			html += "</tbody>";
			html += "</table>";
			html += "</div>";
			html += "</body>";
			html += "</body>";

			html += " <div>";
			html += "		<span class='form-control-static pull-left'>";
			html += "			<font color='#FF0000' >Para a busca mais detalhada digitar palavra ou parte dela no campo de busca. </font>";
			html += "		</span>";
			html += " </div>";

			var sizeZoom = "full";
			if (typeof miniZoom != "undefined") {
				sizeZoom = "large";
			}

			var zoommodal = FLUIGC.modal({
				title: title,
				content: html,
				formModal: false,
				size: sizeZoom,
				id: 'modal-zoom-' + type,
				actions: [{
					'label': 'Selecionar',
					'classType': 'zoom-selected btn-warning',
					'autoClose': false,
				}, {
					'label': 'Fechar',
					'classType': 'zoom-close',
					'autoClose': false
				}, {
					'label': 'Top',
					'classType': 'zoom-top btn-primary',
					'autoClose': false
				}]
			}, function (err, data) {
				if (err) {
					FLUIGC.toast({ title: 'Erro:', message: err, type: 'danger' });
				} else {
					var trimarray = function (fields) {
						for (var i = 0; i < fields.length; i++) {
							fields[i] = fields[i].trim();
						}
						return fields;
					}

					var urlrequest = function () {
						var request = "/ecm/api/rest/ecm/dataset/",
							json = {};

						if (dataset != null) {
							request += "getDatasetZoom";
							json.datasetId = dataset;
						} else if (cardDatasetId != null) {
							request += "getCardDatasetValues";
							json.cardDatasetId = cardDatasetId;
						}

						if (resultfields != null && resultfields.length > 0) {
							json.resultFields = trimarray(resultfields.split(","));
						}

						if (filters != null && filters.length > 0) {
							json.filterFields = trimarray(filters.split(","));
						}

						if (likefield != null && likefield.length > 0 && likevalue != null && likevalue.length > 0) {
							json.likeField = likefield;
							json.likeValue = likevalue;
						}

						var searchValue = $("#search").val();
						if (searchValue && searchValue.length > 0) {
							json.searchValue = searchValue;

							if (searchby && searchby != "") {
								json.searchField = searchby;
							} else {
								json.searchField = fields.split(",")[0];
							}
						}
						else if (searchValue == "") {
							json.searchValue = "";

							if (searchby && searchby != "") {
								json.searchField = searchby;
							} else {
								json.searchField = fields.split(",")[0];
							}
						}

						return request += "?json=" + encodeURIComponent(JSON.stringify(json));
					};

					var searchtable = function (text) {
						var keys = (typeof zoomKeyUp !== 'undefined') ? zoomKeyUp : 1;
						if (text.length >= keys || text.length == 0) {
							var table = $('.table-zoom > tbody');
							table.find('tr').each(function (index, row) {
								var allCells = $(row).find('td');
								if (allCells.length > 0) {
									var found = false;
									allCells.each(function (index, td) {
										var regExp = new RegExp(text, 'i');
										if (regExp.test($(td).text())) {
											found = true;
											return false;
										}
									});
									if (found == true) $(row).show(); else $(row).hide();
								}
							});
						}

					}

					var setup = function (lista) {
						$(".table-zoom > thead").html("");
						var l = lista.split(",");
						var html = "<tr>";
						for (var i = 0; i < l.length; i++) {
							showfields.push(l[i]);
							html += "<th>" + l[i + 1] + "</th>"
							i++;
						}
						html += "</tr>";
						$(".table-zoom > thead").append(html);
					}

					var readydataset = function (dataset) {
						globaldataset = dataset;
						for (var i = 0; i < dataset.length; i++) {
							var row = dataset[i];
							if (i == 0) {
								var classe = "active";
							} else {
								var classe = "";
							}
							var html = "<tr data-dataset=" + i + " class='" + classe + "'>";
							for (var x = 0; x < showfields.length; x++) {
								html += "<td>" + row[showfields[x]] + "</td>";

							}
							html += "</tr>";
							$(".table-zoom > tbody").append(html);


						}
						/*if(dataset.length == 1){
							var row = globaldataset[$(".table-zoom tbody .active").data("dataset")];
				 			row["type"] = type;
				 			zoommodal.remove();
				 			setSelectedZoomItem(row);
				 			
				 			if(isHeaderHide){
				 				$("#workflowview-header",window.parent.document).show();
				 			}
				 			if(isFixedHide){
				 				$(".fixedTopBar",window.parent.document).show();
				 			}
				 			
				 			if (mobile == "true"){
								//$("form").show();
							}
				 			$("#"+type).focus();
				 		}*/
						$(".table-zoom > tbody > tr").click(function () {
							$(".table-zoom > tbody > tr").removeClass("active");
							$(this).addClass("active");
							current = $(this).data("dataset");
						});
						$(".table-zoom > tbody > tr").dblclick(function () {
							var row = globaldataset[$(this).data("dataset")];
							row["type"] = type;
							zoommodal.remove();
							setSelectedZoomItem(row);
							;
							if (isHeaderHide) {
								$("#workflowview-header", window.parent.document).show();
							}
							if (isFixedHide) {
								$(".fixedTopBar", window.parent.document).show();
							}

							if (mobile == "true") {
								//$("form").show();
							}
							$("#" + type).nextAll('input').first().focus();
						});
						$("#search").focus();
						loading.hide();
					}
					var finished = true;
					var dosearch = function () {
						finished = false;
						var url = urlrequest();
						$(".table-zoom > tbody").html("");

						console.log("url", url)

						loading.show();

						$.ajax({
							type: "GET",
							dataType: "json",
							url: url,
							data: "",
							error: function (XMLHttpRequest, textStatus, errorThrown) {
								console.log("dataset error", XMLHttpRequest, textStatus, errorThrown);
								finished = true;
							},
							success: function (data, status, xhr) {
								console.log("dataset sucess", data, status, xhr)
								var dataset = data["invdata"];
								readydataset(dataset);
								finished = true;
							}
						});
					}

					var timeout;
					$('#search').keyup(function (e) {
						console.log("search", e)
						clearTimeout(timeout);
						var keycode;
						if (window.event) {
							keycode = window.event.keyCode;
						} else if (e) {
							keycode = e.which;
						} else {
							return true;
						}
						console.log("search", keycode);
						if (keycode == 13) {
							if (finished) {
								dosearch();
							}
						} else {
							timeout = setTimeout(searchtable($(this).val()), 500);
						}
					});

					$('.zoom-selected').click(function () {
						var row = globaldataset[current];
						row["type"] = type;
						zoommodal.remove();
						setSelectedZoomItem(row);
						if (isHeaderHide) {
							$("#workflowview-header", window.parent.document).show();
						}
						if (isFixedHide) {
							$(".fixedTopBar", window.parent.document).show();
						}

						if (mobile == "true") {
							//$("form").show();
						}
						$("#" + type).nextAll('input').first().focus();
					});

					$('.zoom-close').click(function () {
						if (isHeaderHide) {
							$("#workflowview-header", window.parent.document).show();
						}
						if (isFixedHide) {
							$(".fixedTopBar", window.parent.document).show();
						}
						if (mobile == "true") {
							//$("form").show();
						}
						$("#" + type).val("");
						//			 			$("#"+type).val($("#search").val());
						//			 			$("#"+type).trigger("change");
						removedZoomItem(type);
						zoommodal.remove();
						$("#" + type).focus();
					});

					$('.zoom-top').click(function () {
						$('#loading-zoom').scrollTop(0);
					});



					$('.modal-header .close').click(function () {
						if (isHeaderHide) {
							$("#workflowview-header", window.parent.document).show();
						}
						if (isFixedHide) {
							$(".fixedTopBar", window.parent.document).show();
						}
						if (mobile == "true") {
							//$("form").show();
						}
					});

					setup(fields);
					dosearch();

				}
			});

		},
		/**
		 * Função trigger
		 * @description Realiza o gatilho do campo zoom personalizado baseado nos parametros informados. (chama as funções padrões setSelectedZoomItem e removedZoomItem)
		 * @memberof TDIZOOM
		 * @param {*} dataset Dataset a ser consultado
		 * @param {*} searchby Pesquisar por
		 * @param {*} searchValue Valor a ser pesquisado
		 * @param {*} filters Filtro
		 * @param {*} type Tipo
		 * @example tdizoom.trigger("nomeDataset", "campoDatasetPesquisar", "valorPesquisar", "filtro,valorfiltro", "nome_do_campo");
		 * @example TDIZOOM, ZOOM
		 * @example 
		 * @author Alisson Hausmann
		 */
		trigger: function (dataset, searchby, searchValue, filters, type) {
	        var trimarray = function (fields) {
	            for (var i = 0; i < fields.length; i++) {
	                fields[i] = fields[i].trim();
	            }
	            return fields;
	        }
	        var urlrequest = function () {
	            var request = "/ecm/api/rest/ecm/dataset/";
	            var json = {};
	
	            if (dataset != null) {
	                request += "getDatasetZoom";
	                json.datasetId = dataset;
	            } else if (cardDatasetId != null) {
	                request += "getCardDatasetValues";
	                json.cardDatasetId = cardDatasetId;
	            }
	
	            if (filters != null && filters.length > 0) {
	                json.filterFields = trimarray(filters.split(","));
	            }
	
	            if (searchValue && searchValue.length > 0) {
	                json.searchValue = searchValue;
	                json.searchField = searchby;
	            }else if (searchValue == "") {
	                json.searchValue = "";
	                json.searchField = searchby;
	            }
	            return request += "?json=" + encodeURI(JSON.stringify(json));
	        };
	
	        var dosearch = function () {
	            var url = urlrequest();
	            $.ajax({
	                type: "GET",
	                dataType: "json",
	                url: url,
	                data: "",
	                error: function() {
	                    removedZoomItem(type);
	                },
	                success: function (data) {
	                    var dataset = data["invdata"];
	                    if(dataset.length > 0 && searchValue.trim() != ""){
	                        var row = dataset[0];
	                        row["type"] = type;
	                        setSelectedZoomItem(row);
	                    }else{
	                        removedZoomItem(type);
	                    }
	                }
	            });
	        }
	        dosearch();
		}
	}
})();

var tdizoomCheck = (function(){
	var zoommodal = null;
	var loading = FLUIGC.loading('#loading-zoom');
	return {
		open: function(dataset, fields, resultfields, title, filters, type, likefield, likevalue, searchby) {
			isHeaderVisible = $("#workflowview-header", window.parent.document).is(":visible");
			isFixedVisible = $(".fixedTopBar", window.parent.document).is(":visible");
			isHeaderHide = null;
			isFixedHide = null;
			if (isHeaderVisible) {
				$("#workflowview-header", window.parent.document).hide();
				isHeaderHide = true;
			}
			if (isFixedVisible) {
				$(".fixedTopBar", window.parent.document).hide();
				isFixedHide = true;
			}
			
			mobile = (typeof mobile !== 'undefined') ? mobile : "false";
			if (mobile == "true") {
				//$("form").hide();
			}
			
			console.log(likefield)
			
	 		loading.show();
			
			var showfields = [];
			var globaldataset = [];
			var current = 0;
			
			if (zoommodal != null) {
				zoommodal.remove();
				zoommodal = null;
				
				$(".table-zoom > thead").html("");
				$(".table-zoom > tbody").html("");
			}
			
			var html = "<body class='fluig-style-guide' style='z-index:-1'>" ;
			html += "<div class='input-group'>" ;
			html += "<span class='input-group-addon'><span class='fluigicon fluigicon-search'></span></span>" ;
			html += "<input type='text' class='form-control' id='search' value='" + ($("#"+type).length > 0 ? $("#"+type).val() : "") + "' placeholder='Digite o texto e utilize o <Enter> para buscar'>";
			html += "</div>" ;
			if (typeof miniZoom != "undefined") {
				html += "<div class='' id='loading-zoom' style='overflow-y: auto; height: 120px;'>";
			} else {
				html += "<div class='' id='loading-zoom' style='overflow-y: auto; height: 300px;'>";
			}
			html += "<table  class='table table-hover table-zoom'>" ;
			html += "<thead>" ;
			html += "</thead>" ;
			html += "<tbody>" ;
			html += "</tbody>" ;
			html += "</table>" ;
			html += "</div>" ;
			html += "</body>";
			
			html += " <div>";
			html += "		<span class='form-control-static pull-left'>";
			html += "			<font color='#FF0000' >Para a busca mais detalhada digitar palavra ou parte dela no campo de busca. </font>";
			html += "		</span>";
			html += " </div>";
			
			var sizeZoom = "full";
			if (typeof miniZoom != "undefined") {
				sizeZoom = "large";
			}
			
			var zoommodal = FLUIGC.modal({
			    title: title,
			    content: html,
			    formModal: false,
			    size: sizeZoom,
			    id: 'modal-zoom-' + type,
			    actions: [
			    {
			        'label': 'Selecionar Todos',
			        'classType': 'check-all btn-info',
			        'autoClose': false,
			    },
			    {
			        'label': 'Confirmar',
			        'classType': 'zoom-selected btn-warning',
			        'autoClose': false,
			    },{
			        'label': 'Fechar',
			        'classType': 'zoom-close',
			        'autoClose': false
			    },{
			        'label': 'Top',
			        'classType': 'zoom-top btn-primary',
			        'autoClose': false
			    }]
			}, function(err, data) {
			    if(err) {
					FLUIGC.toast({ title: 'Erro:', message: err, type: 'danger' });
			    } else {
					var trimarray = function (fields) {
				    	for(var i=0; i < fields.length; i++){
				    		fields[i] = fields[i].trim();
				    	}
				    	return fields;
				    }
					
					check = false;
					
					var urlrequest = function(){
					    var request = "/ecm/api/rest/ecm/dataset/",
					        json = {};
					    
					    if (dataset != null) {
					        request += "getDatasetZoom";
					        json.datasetId = dataset;
					    } else if(cardDatasetId != null){
					        request += "getCardDatasetValues";
					        json.cardDatasetId = cardDatasetId;
					    }
					    
					    if (resultfields != null && resultfields.length > 0 ){
					    	json.resultFields = trimarray(resultfields.split(","));
					    }
					    
					    if (filters != null && filters.length > 0 ){
					        json.filterFields = trimarray(filters.split(","));
					    }
					    
					    if (likefield != null && likefield.length > 0 && likevalue != null && likevalue.length > 0 ){
					        json.likeField = likefield;
					        json.likeValue = likevalue;
					    }
					    
					    var searchValue = $("#search").val();
					    if(searchValue && searchValue.length > 0) {
					    	json.searchValue = searchValue;
					    	
					    	if (searchby && searchby != "") {
						        json.searchField = searchby;
					    	} else {
					    		json.searchField = fields.split(",")[0];
					    	}
					    	
					    }
					    
					    return request +="?json=" + encodeURIComponent(JSON.stringify(json));
					};
					
					/*var searchtable = function (text) {
						var table = $('.table-zoom > tbody');
						table.find('tr').each(function(index, row) {
							var allCells = $(row).find('td');
							if(allCells.length > 0) {
								var found = false;
								allCells.each(function(index, td) {
									var regExp = new RegExp(text, 'i');
									if(regExp.test($(td).text())) {
										found = true;
										return false;
									}
								});
								if(found == true){
									$(row).show(); 
									$(row).find("td input").removeClass("hide-line");
								}else{
									$(row).hide();
									$(row).find("td input").addClass("hide-line");
								}
							}
						});
					}*/
					
					var searchtable = function (text) {
						var keys = (typeof zoomKeyUp !== 'undefined') ? zoomKeyUp : 1;
						if (text.length >= keys || text.length == 0) {
							var table = $('.table-zoom > tbody');
							table.find('tr').each(function (index, row) {
								var allCells = $(row).find('td');
								if (allCells.length > 0) {
									var found = false;
									allCells.each(function (index, td) {
										var regExp = new RegExp(text, 'i');
										if (regExp.test($(td).text())) {
											found = true;
											return false;
										}
									});
									if (found == true) $(row).show(); else $(row).hide();
								}
							});
						}
					}
					
					var setup = function(lista) {
						var l = lista.split(",");
						var html = "<tr>";
						for (var i=0; i<l.length; i++) {
							if (i==0){
								html += "<th class=''></th>"
							}
							showfields.push(l[i]);
							html += "<th>" + l[i+1] + "</th>"
							i++;
						}
						html += "</tr>";
				 		$(".table-zoom > thead").append(html);
					}
					
					var readydataset = function(dataset) {
						globaldataset = dataset;
						for (var i=0; i<dataset.length; i++) {
							var row = dataset[i];
							var html = "<tr data-dataset=" + i + ">";
							for (var x=0; x<showfields.length; x++) {
								if(x==0){
									html += "<td><input class='check-return' type='checkbox' id='check_zoom___"+i+"'/></td>";
								}
								html += "<td>" + row[showfields[x]] + "</td>";
								
							}
							html += "</tr>";
					 		$(".table-zoom > tbody").append(html);
						}
//				 		$(".table-zoom > tbody > tr").click(function() {
//				 			$(".table-zoom > tbody > tr").removeClass("active");
//				 			$(this).addClass("active");
//				 			current = $(this).data("dataset");
//				 		});
//				 		$(".table-zoom > tbody > tr").dblclick(function() {
//				 			var row = globaldataset[$(this).data("dataset")];
//				 			row["type"] = type;
//				 			setSelectedZoomItem(row);
//				 			zoommodal.remove();
//				 			$("#workflowview-header",window.parent.document).show();
//				 			$(".fixedTopBar",window.parent.document).show();
//				 			if (mobile == "true"){
//								//$("form").show();
//							}
//				 		});
				 		loading.hide();
					}
					var finished = true;
					var dosearch = function () {
						finished = false;
						var url = urlrequest();
						$(".table-zoom > tbody").html("");

						console.log("url", url)

						loading.show();

						$.ajax({
							type: "GET",
							dataType: "json",
							url: url,
							data: "",
							error: function (XMLHttpRequest, textStatus, errorThrown) {
								console.log("dataset error", XMLHttpRequest, textStatus, errorThrown);
								finished = true;
							},
							success: function (data, status, xhr) {
								console.log("dataset sucess", data, status, xhr)
								var dataset = data["invdata"];
								readydataset(dataset);
								finished = true;
							}
						});
					}

					var timeout;
					$('#search').keyup(function (e) {
						console.log("search", e)
						clearTimeout(timeout);
						var keycode;
						if (window.event) {
							keycode = window.event.keyCode;
						} else if (e) {
							keycode = e.which;
						} else {
							return true;
						}
						console.log("search", keycode);
						if (keycode == 13) {
							if (finished) {
								dosearch();
							}
						} else {
							timeout = setTimeout(searchtable($(this).val()), 500);
						}
					});	 		
			 		
			 		$(".check-all").click(function(){
			 			if (!check){
			 				$(".check-return").prop("checked", true);
			 				check = true;
			 			}else{
			 				$(".check-return").prop("checked", false);
			 				check = false;
			 			}
			 	   });
					
			 		$('.zoom-selected').click(function() {
			 			$(".check-return").each(function(){
			 				if ($(this).is(":checked")){
			 					if(!$(this).hasClass("hide-line")){
			 						var id = $(this).attr("id").split("___");
			 						var current = parseInt(id[1]);
						 			var row = globaldataset[current];
						 			row["type"] = type;
						 			setSelectedZoomItem(row);
						 			if (mobile == "true"){
										//$("form").show();
									}
			 					}
			 				}
			 			})
			 			zoommodal.remove();
			 			if (isHeaderHide) {
							$("#workflowview-header", window.parent.document).show();
						}
						if (isFixedHide) {
							$(".fixedTopBar", window.parent.document).show();
						}
					});
			 		
			 		$('.zoom-close').click(function() {
			 			if (isHeaderHide) {
							$("#workflowview-header", window.parent.document).show();
						}
						if (isFixedHide) {
							$(".fixedTopBar", window.parent.document).show();
						}
			 			if (mobile == "true"){
							//$("form").show();
						}
			 			removedZoomItem(type);
			 			zoommodal.remove();
			 			if($("#"+type).length > 0){
			 				$("#" + type).val("");
			 				$("#" + type).focus();
			 			}
					});
			 		
			 		$('.zoom-top').click(function() {
			 			$('#loading-zoom').scrollTop(0);
					});
			 		
			 		
			 		
			 		$('.modal-header .close').click(function() {
			 			if (isHeaderHide) {
							$("#workflowview-header", window.parent.document).show();
						}
						if (isFixedHide) {
							$(".fixedTopBar", window.parent.document).show();
						}
						if (mobile == "true") {
							//$("form").show();
						}
					});
			 		
			 		setup(fields);
			 		dosearch();

			    }
			});
		}
	}
})();