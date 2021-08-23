var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,
    myTable: null,

    //método iniciado quando a widget é carregada
    init: function() {
    	this.loadTable();
    	
    }, loadTable: function(el, ev) {
    	var that = this;
        that.myTable = FLUIGC.datatable('#tb_contatos', {
            dataRequest: [],
            renderContent: ['nome', 'telefone'],
            header: [
                {'title': 'Nome'},
                {'title': 'Telefone'},
            ],
            search: {
	            enabled: false,
	        },
	        actions: {
	            enabled: true,
	            template: '.template_itens_actions',
	            actionAreaStyle: 'col-md-9'
	        },
            navButtons: {
                enabled: true,
            },
        }, function(err, data) {
            if(data) {
                dataInit = data;
            }
            else if (err) {
                FLUIGC.toast({
                    message: err,
                    type: 'danger'
                });
            }
        });
    },addRow: function(el, ev) {
    	var nome = $("#nomeContato").val();
    	var telefone = $("#telefoneContato").val();
    		
        var row = {
            nome: nome,
            telefone: telefone,
        };
     
        this.myTable.addRow(0, row);
        
        $("#nomeContato").val("");
        $("#telefoneContato").val("");
    },
    
    delRow: function(el, ev) {
        var itemsToRemove = this.myTable.selectedRows();
     
        if (itemsToRemove.length > 0) {
            for (var i = 0; i <= itemsToRemove.length; i++) {
                this.myTable.removeRow(this.myTable.selectedRows()[0]);
            }
        }
     
        FLUIGC.toast({
            title: '',
            message: "Contato removido!",
            type: 'success'
        });
     
    },
    
    startProcess: function (){
    	let status = "";
    	let fluighub = new FluigHub();
      
    	const datasetOptions = {
            name: 'inclusao_cadastro_participante',
            fields: [],
            constraints: this.getConstraints(),
            order: [],
        };
    	var that = this;
    	try{
    		fluighub.execute(2,'post',JSON.stringify(datasetOptions),function(data){
    			data = JSON.parse(data.result);
    			
    			if (data.content.values){
    				if (data.content.values.length > 0){
    					status = data.content.values[0].STATUS;
    				}
    			}
    			
    			if(status == "success"){
    				FLUIGIP.USEFUL.showSuccess("Cadastro realizado com sucesso: " + data.content.values[0].IPROCESS);
    				
    				$("#li-dadosIniciais").addClass("hide");
    				$("#dadosIniciais").addClass("hide");
    				$("#li-dadosCadastrais").addClass("hide");
    				$("#dadosCadastrais").addClass("hide");
    				$("#li-dadosGerais").addClass("hide");
    				$("#dadosGerais").addClass("hide");
    				$("#li-classeSocial").addClass("hide");
    				$("#classeSocial").addClass("hide");
    				
    				$("#btnSalvar").addClass("hide");
    				
    			}else{
    				FLUIGIP.USEFUL.showError(data.content.values[0].MESSAGE);
    			}
    		
    		})
    	}catch(e){
    		this.showError("Erro ao processar o cadastro, entre em contato com o administrador do sistema.")
    	}
    	
    	return;
    },
    
    getConstraints: function(){
    	let constraints = [];
    	constraints = this.getType(constraints);
    	constraints = this.getTable(constraints);
    	
    	$(".gravar").each(function (obj) {
    		constraints.push({
	            _field: $(this).attr("name"),
	            _initialValue: $(this).val(),
	            _finalValue: $(this).val(),
	            _type: 1,
	            _likeSearch: false,
	        });
    	});
    	
    	return constraints;
    	
    },
    
    getType: function(constraints){
    	 $(".autorizacao").each(function (obj) {
    		 if($(this).is(":checked")){
    		    constraints.push({
    			    _field: $(this).attr("name"),
    			    _initialValue: $(this).val(),
    			    _finalValue: $(this).val(),
    			    _type: 1,
    			    _likeSearch: false,
    		    });
    		 }
    	 });
    	 
    	 return constraints;
    },
    
    getTable: function(constraints){
    	var data = this.myTable.getData();
    	
    	data = JSON.stringify(this.myTable.getData());
    	
    	constraints.push({
		    _field: 'tbContatos',
		    _initialValue: data,
		    _finalValue: data,
		    _type: 1,
		    _likeSearch: false,
	    });

    	return constraints;
    },
    
    vldParticipante: function(){
    	var retorno = "";
    	var parametros = [];
    	var fluigHub = new FluigHub();
    	
    	parametros.push({
            _field: "CPF",
            _initialValue: $("#cpf").val(),
            _finalValue: $("#cpf").val(),
            _type: 1,
            _likeSearch: false,
        });
      
    	var dataset = {
            name: 'valida_inclusao_participante',
            fields: [],
            constraints: parametros,
            order: [],
        };

    	try{
    		fluigHub.execute(2,'post',JSON.stringify(dataset),function(data){
    			data = JSON.parse(data.result);
    			
    			if (data.content.values){
    				if (data.content.values.length > 0){
    					status = data.content.values[0].STATUS;
    					
    					if (status == 'true'){
    						FLUIGIP.USEFUL.showWarning("Participante já cadastrado!!");
    						
    						$("#li-dadosIniciais").addClass("hide");
    	    				$("#dadosIniciais").addClass("hide");
    	    				$("#li-dadosCadastrais").addClass("hide");
    	    				$("#dadosCadastrais").addClass("hide");
    	    				$("#li-dadosGerais").addClass("hide");
    	    				$("#dadosGerais").addClass("hide");
    	    				$("#li-classeSocial").addClass("hide");
    	    				$("#classeSocial").addClass("hide");
    	    				
    	    				$("#btnSalvar").addClass("hide");
    					}
    				}
    			}
    		});
    	}catch(e){
    		FLUIGIP.USEFUL.showError("Erro ao consultar o cadastro, entre em contato com o administrador do sistema.")
    	}
    	
    	return;
    },
  
    //BIND de eventos
    bindings: {
        local: {
            'start-process': ['click_startProcess'],
            'datatable-add-row': ['click_addRow'],
    		'datatable-del-row': ['click_delRow'],
    		'valida-participante': ['change_vldParticipante']
        },
        global: {}
    },
    
    executeAction: function(htmlElement, event) {
    }

});

$(document).on('keyup', '.mCep',function(){
    var valor = mCep($(this).val());
    $(this).val(valor);
});

$(document).on('blur', '.mCep',function(){
    var valor = mCep($(this).val());
    $(this).val(valor);
});

$(document).on('keyup', '.mCpf',function(){
    var valor = mCpf($(this).val());
    $(this).val(valor);
});

$(document).on('blur', '.mCpf',function(){
    var valor = mCpf($(this).val());
    $(this).val(valor);
});

$(document).on('keyup', '.mRg',function(){
    var valor = mRg($(this).val());
    $(this).val(valor);
});

$(document).on('blur', '.mRg',function(){
    var valor = mRg($(this).val());
    $(this).val(valor);
});

function mCep(v){
    v=v.replace(/D/g,"");                
    v=v.replace(/^(\d{5})(\d)/,"$1-$2"); 
    return v;
}

function mCpf(v){
    v=v.replace(/\D/g,"");                    
    v=v.replace(/(\d{3})(\d)/,"$1.$2");      
    v=v.replace(/(\d{3})(\d)/,"$1.$2");       
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2"); 
    return v;
}

function mRg(v){
    v=v.replace(/\D/g,"");                    
    v=v.replace(/(\d{2})(\d)/,"$1.$2");      
    v=v.replace(/(\d{3})(\d)/,"$1.$2");       
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2"); 
    return v;
}

$(document).ready(function(){
	
	$("#dataCadastro").val(getDate());
	
	$("#termo-autorizacao-sim").change(function() {
		if($("#termo-autorizacao-sim").prop("checked")){
			$("#li-dadosIniciais").addClass("active") 
			$("#li-dadosIniciais").removeClass("hide");
			$("#dadosIniciais").removeClass("hide");
			$("#termoAutorizacao").addClass("hide");
		}
	});
	
	$("#termo-autorizacao-nao").change(function() {
		if($("#termo-autorizacao-nao").prop("checked")){
			$("#li-dadosIniciais").removeClass("active") 
			$("#li-dadosIniciais").addClass("hide");
			$("#dadosIniciais").addClass("hide");
		}
	});
	
	$("#responsavel-sim").change(function() {
		if($("#responsavel-sim").prop("checked")){
			$("#li-dadosCadastrais").removeClass("hide");
		}
	});
	
	$("#responsavel-nao").change(function() {
		if($("#responsavel-nao").prop("checked")){ 
			$("#li-dadosCadastrais").addClass("hide");
			$("#li-dadosGerais").addClass("hide");
			$("#li-classeSocial").addClass("hide");
		}
	});
	
});

function changeHeader(tab){
	switch(tab){
	case "dadosIniciais": 
		$("#li-dadosIniciais").addClass("active");
		$("#dadosIniciais").removeClass("hide");
		$("#li-dadosCadastrais").removeClass("active");
		$("#dadosCadastrais").addClass("hide");
		$("#li-dadosGerais").removeClass("active");
		$("#dadosGerais").addClass("hide");
		$("#li-classeSocial").removeClass("active");
		$("#classeSocial").addClass("hide");
		break

	case "dadosCadastrais":
		$("#li-dadosIniciais").removeClass("active");
		$("#dadosIniciais").addClass("hide");
		$("#li-dadosCadastrais").addClass("active");
		$("#dadosCadastrais").removeClass("hide");
		$("#li-dadosGerais").removeClass("active");
		$("#dadosGerais").addClass("hide");
		$("#li-classeSocial").removeClass("active");
		$("#classeSocial").addClass("hide");
		break

	case "dadosGerais": 
		$("#li-dadosIniciais").removeClass("active");
		$("#dadosIniciais").addClass("hide");
		$("#li-dadosCadastrais").removeClass("active");
		$("#dadosCadastrais").addClass("hide");
		$("#li-dadosGerais").addClass("active");
		$("#dadosGerais").removeClass("hide");
		$("#li-classeSocial").removeClass("active");
		$("#classeSocial").addClass("hide");
		break
		
	case "classeSocial": 
		$("#li-dadosIniciais").removeClass("active");
		$("#dadosIniciais").addClass("hide");
		$("#li-dadosCadastrais").removeClass("active");
		$("#dadosCadastrais").addClass("hide");
		$("#li-dadosGerais").removeClass("active");
		$("#dadosGerais").addClass("hide");
		$("#li-classeSocial").addClass("active");
		$("#classeSocial").removeClass("hide");
	}
}

function validacao(){
	if($("#idade").val() < "18"){
		//Dados Iniciais
		$("#termoAutorizacaoResponsavel").removeClass("hide");
		FLUIGIP.execChangeFields($("#nomeResponsavel"), false);
		FLUIGIP.execChangeFields($("#rgResponsavel"), false);
		FLUIGIP.execChangeFields($("#celularResponsavel"), false);
		FLUIGIP.execChangeFields($("#emailResponsavel"), false);
		
		$("#nomeResponsavel").siblings("label").attr('class','control-label required');
		$("#nomeResponsavel").siblings("input").attr('attributes','control-label required');
		$("#rgResponsavel").siblings("label").attr('class','control-label required');
		$("#celularResponsavel").siblings("label").attr('class','control-label required');
		$("#emailResponsavel").siblings("label").attr('class','control-label required');
		
		//Dados Cadastrais
		$("#li-dadosCadastrais").addClass("hide");
		$("#dadosCadastrais").addClass("hide");
		
		//Informações Participantes
		$("#li-dadosGerais").addClass("hide");
		$("#dadosGerais").addClass("hide");
		
		//Classe Social
		$("#li-classeSocial").addClass("hide");
		$("#classeSocial").addClass("hide");
		
	}else{
		//Dados Iniciais
		$("#termoAutorizacaoResponsavel").addClass("hide");
		FLUIGIP.execChangeFields($("#nomeResponsavel"), true);
		FLUIGIP.execChangeFields($("#rgResponsavel"), true);
		FLUIGIP.execChangeFields($("#celularResponsavel"), true);
		FLUIGIP.execChangeFields($("#emailResponsavel"), true);
		
		$("#nomeResponsavel").siblings("label").attr('class','control-label');
		$("#rgResponsavel").siblings("label").attr('class','control-label');
		$("#celularResponsavel").siblings("label").attr('class','control-label');
		$("#emailResponsavel").siblings("label").attr('class','control-label');
		
		//Dados Cadastrais
		//$("#li-dadosCadastrais").removeClass("hide");
	}
	
}

function vldSexo(obj){
	var sexo = $(obj).val();
	
	if(sexo == "F"){
		$(".reacaoTonico").removeClass("hide");
		FLUIGIP.execChangeFields($("#reacaoTonico"), false);
		$("#reacaoTonico").siblings("label").attr('class','control-label required');
		
		$(".classificacaoEvelhecimentoPele").removeClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoEvelhecimentoPele"), false);
		$("#classificacaoEvelhecimentoPele").siblings("label").attr('class','control-label required');

		$(".classificacaoManchasFacial").removeClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoManchasFacial"), false);
		$("#classificacaoManchasFacial").siblings("label").attr('class','control-label required');

		$(".classificacaoOlheiras").removeClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoOlheiras"), false);
		$("#classificacaoOlheiras").siblings("label").attr('class','control-label required');

		$(".classificacaoCelulites").removeClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoCelulites"), false);
		$("#classificacaoCelulites").siblings("label").attr('class','control-label required');

		$(".classificacaoEstrias").removeClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoEstrias"), false);
		$("#classificacaoEstrias").siblings("label").attr('class','control-label required');

		$(".classificacaoUnhas").removeClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoUnhas"), false);
		$("#classificacaoUnhas").siblings("label").attr('class','control-label required');

		$(".cicloMenstrual").removeClass("hide");
		FLUIGIP.execChangeFields($("#cicloMenstrual"), false);
		$("#cicloMenstrual").siblings("label").attr('class','control-label required');
		
		//Desabilita campos para sexo Masculino
		
		$(".reacaoPosBarba").addClass("hide");
		FLUIGIP.execChangeFields($("#reacaoPosBarba"), true);
		$("#reacaoPosBarba").siblings("label").attr('class','control-label hide');

		$(".tipoDepilacao").addClass("hide");
		FLUIGIP.execChangeFields($("#tipoDepilacao"), true);
		$("#tipoDepilacao").siblings("label").attr('class','control-label hide');

		$(".pelosAxilas").addClass("hide");
		FLUIGIP.execChangeFields($("#pelosAxilas"), true);
		$("#pelosAxilas").siblings("label").attr('class','control-label hide');

		$(".transpiracao").addClass("hide");
		FLUIGIP.execChangeFields($("#transpiracao"), true);
		$("#transpiracao").siblings("label").attr('class','control-label hide');

	}else if(sexo == "M"){
		$(".reacaoPosBarba").removeClass("hide");
		FLUIGIP.execChangeFields($("#reacaoPosBarba"), false);
		$("#reacaoPosBarba").siblings("label").attr('class','control-label required');
		
		$(".tipoDepilacao").removeClass("hide");
		FLUIGIP.execChangeFields($("#tipoDepilacao"), false);
		$("#tipoDepilacao").siblings("label").attr('class','control-label required');

		$(".pelosAxilas").removeClass("hide");
		FLUIGIP.execChangeFields($("#pelosAxilas"), false);
		$("#pelosAxilas").siblings("label").attr('class','control-label required');

		$(".transpiracao").removeClass("hide");
		FLUIGIP.execChangeFields($("#transpiracao"), false);
		$("#transpiracao").siblings("label").attr('class','control-label required');
		
		//Desabilita Campos para Sexo Feminino
		$(".reacaoTonico").addClass("hide");
		FLUIGIP.execChangeFields($("#reacaoTonico"), true);
		$("#reacaoTonico").siblings("label").attr('class','control-label hide');
		
		$(".classificacaoEvelhecimentoPele").addClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoEvelhecimentoPele"), true);
		$("#classificacaoEvelhecimentoPele").siblings("label").attr('class','control-label hide');
		
		$(".classificacaoManchasFacial").addClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoManchasFacial"), true);
		$("#classificacaoManchasFacial").siblings("label").attr('class','control-label hide');
		
		$(".classificacaoOlheiras").addClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoOlheiras"), true);
		$("#classificacaoOlheiras").siblings("label").attr('class','control-label hide');
		
		$(".classificacaoCelulites").addClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoCelulites"), true);
		$("#classificacaoCelulites").siblings("label").attr('class','control-label hide');
		
		$(".classificacaoEstrias").addClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoEstrias"), true);
		$("#classificacaoEstrias").siblings("label").attr('class','control-label hide');
		
		$(".classificacaoUnhas").addClass("hide");
		FLUIGIP.execChangeFields($("#classificacaoUnhas"), true);
		$("#classificacaoUnhas").siblings("label").attr('class','control-label hide');
		
		$(".cicloMenstrual").addClass("hide");
		FLUIGIP.execChangeFields($("#cicloMenstrual"), true);
		$("#cicloMenstrual").siblings("label").attr('class','control-label hide');
		
	}
}

function preencheIdade(){
	var dataAtual = new Date,
	    ano_atual = dataAtual.getFullYear(),
	    mes_atual = dataAtual.getMonth() + 1,
	    dia_atual = dataAtual.getDate();
        
    var dataNascimento = $("#dataNascimento").val(), 
    	ano_aniversario = dataNascimento.substr(6,4),
        mes_aniversario = dataNascimento.substr(3,2),
        dia_aniversario = dataNascimento.substr(0,2);

   var idade = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
    	idade--;
    }
    
    $("#dataNasc").val($("#dataNascimento").val());
    $("#idade").val(idade < 0 ? 0 : idade);
}

function defineFototipo(){
	var soma = 0;
	var fototipo = "";
	var corOlhos = $("#corOlhos").val();
	var corCabelos = $("#corCabelos").val();
	var corPele = $("#corPele").val();
	var exposicaoSolar = $("#exposicaoSolar").val();
	
	//Cor dos Olhos
	if(corOlhos == "" || corOlhos == "1" || corOlhos == "2"){
		soma += 0;
		
	}else if (corOlhos == "3"){
		soma += 1;
		
	}else {
		soma += 2;
	}
	
	//Cor dos Cabelos
	if(corCabelos == "" || corCabelos == "1" || corCabelos == "2"){
		soma += 0;
		
	}else if (corCabelos == "3"){
		soma += 1;
		
	}else if (corCabelos == "4"){
		soma += 2;
		
	}else {
		soma += 3;
	}
	
	//Cor da Pele
	if(corPele == "" || corPele == "1" || corPele == "2"){
		soma += 0;
		
	}else if (corPele == "3"){
		soma += 1;
		
	}else if (corPele == "4"){
		soma += 2;
		
	}else {
		soma += 3;
	}
	
	//Exposição da Solar
	if(exposicaoSolar == "" || exposicaoSolar == "1"){
		soma += 0;
		
	}else if (corPele == "2"){
		soma += 1;
		
	}else if (corPele == "3"){
		soma += 2;
	
	}else if (corPele == "4"){
		soma += 3;
		
	}else if (corPele == "5"){
		soma += 4;
		
	}else {
		soma += 5;
	}
	
	if(soma <= 3){
		fototipo = "Fototipo I ou II"
			
	}else if(soma >= 4 && soma <= 6){
		fototipo = "Fototipo III ou IV"
			
	}else{
		fototipo = "Fototipo acima de IV"
	}
	
	$("#fototipoResp").val(fototipo);
}

function defineSensibilidadePele(){
	var soma = 0;
	var sensibilidade = "";
	var reacaoTemperatura = $("#reacaoTemperatura").val();
	var reacaoSabonete = $("#reacaoSabonete").val();
	var reacaoTonico = $("#reacaoTonico").val();
	var reacaoPosBarba = $("#reacaoPosBarba").val();
	var descamar = $("#descamar").val();
	
	//Reação da Pele a Temperaturas
	if(reacaoTemperatura == "" || reacaoTemperatura == "N"){
		soma += 0;
	}else {
		soma += 1;
	}
	
	//Reação da Pele ao Sabonete
	if(reacaoSabonete == "" || reacaoSabonete == "N"){
		soma += 0;
	}else {
		soma += 1;
	}
	
	//Reação da Pele ao Tonico
	if(reacaoTonico == "" || reacaoTonico == "N"){
		soma += 0;
	}else {
		soma += 1;
	}
	
	//Reação da Pele a Pos Barba
	if(reacaoPosBarba == "" || reacaoPosBarba == "N"){
		soma += 0;
	}else {
		soma += 1;
	}
	
	//Descama com frequência?
	if(descamar == "" || descamar == "N"){
		soma += 0;
	}else {
		soma += 1;
	}
	
	if(soma < 1){
		sensibilidade = "Pele normal"
	}else{
		sensibilidade = "Pele sensível"
	}
	
	$("#sensibilidadeResp").val(sensibilidade);
}

function defineClasseSocial(){
	var soma = 0;
	var classeSocial = "";
	var banheiros = $("#qtdBanheiros").val()
	var empregadosDomesticos = $("#qtdEmpregados").val()
	var automoveis = $("#qtdAutomoveis").val()
	var microcomputadores = $("#qtdMicrocomputadores").val()
	var lavaLouca = $("#qtdLavaLoucas").val()
	var geladeira = $("#qtdGeladeiras").val()
	var freezer = $("#qtdFreezer").val()
	var lavaRoupa = $("#qtdLavaRoupas").val()
	var dvd = $("#qtdDVD").val()
	var microondas = $("#qtdMicroondas").val()
	var motocicleta = $("#qtdMotocicletas").val()
	var secadorDeRoupa = $("#qtdSecadorRoupas").val()
	var grauInstrucao = $("#grauInstrucao").val()
	var aguaEncanada = $("#aguaEncanada").val()
	var ruaPavimentada = $("#ruaPavimentada").val()
	
	
	if (banheiros == "0"){
		soma += 0;
	}else if (banheiros == "1"){
		soma += 3;
	}else if (banheiros == "2"){
		soma += 7;
	}else if (banheiros == "3"){
		soma += 10;
	}else {
		soma += 14;
	}
	
	if (empregadosDomesticos == "0"){
		soma += 0;
	}else if (empregadosDomesticos == "1"){
		soma += 3;
	}else if (empregadosDomesticos == "2"){
		soma += 7;
	}else if (empregadosDomesticos == "3"){
		soma += 10;
	}else {
		soma += 13;
	}
	
	if (automoveis == "0"){
		soma += 0;
	}else if (automoveis == "1"){
		soma += 3;
	}else if (automoveis == "2"){
		soma += 5;
	}else if (automoveis == "3"){
		soma += 8;
	}else {
		soma += 11;
	}
	
	if (microcomputadores == "0"){
		soma += 0;
	}else if (microcomputadores == "1"){
		soma += 3;
	}else if (microcomputadores == "2"){
		soma += 6;
	}else if (microcomputadores == "3"){
		soma += 8;
	}else {
		soma += 11;
	}
	
	if (lavaLouca == "0"){
		soma += 0;
	}else if (lavaLouca == "1"){
		soma += 3;
	}else {
		soma += 6;
	}
	
	if (geladeira == "0"){
		soma += 0;
	}else if (geladeira == "1"){
		soma += 2;
	}else if (geladeira == "2"){
		soma += 3;
	}else {
		soma += 5;
	}
	
	if (freezer == "0"){
		soma += 0;
	}else if (freezer == "1"){
		soma += 2;
	}else if (freezer == "2"){
		soma += 4;
	}else {
		soma += 6;
	}
	
	if (lavaRoupa == "0"){
		soma += 0;
	}else if (lavaRoupa == "1"){
		soma += 2;
	}else if (lavaRoupa == "2"){
		soma += 4;
	}else {
		soma += 6;
	}
	
	if (dvd == "0"){
		soma += 0;
	}else if (dvd == "1"){
		soma += 1;
	}else if (dvd == "2"){
		soma += 3;
	}else if (dvd == "3"){
		soma += 4;
	}else {
		soma += 6;
	}
	
	if (microondas == "0"){
		soma += 0;
	}else if (microondas == "1"){
		soma += 2;
	}else {
		soma += 4;
	}
	
	if (motocicleta == "0"){
		soma += 0;
	}else if (motocicleta == "1"){
		soma += 1;
	}else {
		soma += 3;
	}
	
	if (secadorDeRoupa == "0"){
		soma += 0;
	}else {
		soma += 2;
	}
	
	if(grauInstrucao == "0"){
		soma += 0;
	}else if(grauInstrucao == "1"){
		soma += 1;
	}else if(grauInstrucao == "2"){
		soma += 2;
	}else if(grauInstrucao == "3"){
		soma += 4;
	}else{
		soma += 7;
	}
	
	if (aguaEncanada == "S"){
		soma += 4;
	}else {
		soma += 0;
	}
	
	if (ruaPavimentada == "S"){
		soma += 2;
	}else {
		soma += 0;
	}
	
	if(soma >= 45){
		classeSocial = "A"
			
	}else if(soma >= 38 && soma <= 44){
		classeSocial = "B-1"
			
	}else if(soma >= 29 && soma <= 37){
		classeSocial = "B-2"
			
	}else if(soma >= 23 && soma <= 38){
		classeSocial = "C-1"
			
	}else if(soma >= 17 && soma <= 22){
		classeSocial = "C-2"
	
	}else{
		classeSocial = "D-E"
	}
	
	$("#resultClasseSocial").val(classeSocial);

}

function vldLiberacao(aba,camposObrigatorios){
	var result = [];
	
	if (aba == 'dadosIniciais'){
		result = vldCamposObrigatorios(aba);
	}else{
		result = vldCamposObrigatorios(camposObrigatorios);
	}
	
	if(result[0]){
		if (aba == "dadosIniciais"){
			$("#li-dadosIniciais").removeClass("active");
			$("#dadosIniciais").addClass("hide");
			
			$("#li-dadosCadastrais").removeClass("hide");
			$("#li-dadosCadastrais").addClass("active");
			$("#dadosCadastrais").removeClass("hide");
		}else if (aba == "dadosCadastrais"){
			$("#li-dadosCadastrais").removeClass("active");
			$("#dadosCadastrais").addClass("hide");
			
			$("#li-dadosGerais").removeClass("hide");
			$("#li-dadosGerais").addClass("active");
			$("#dadosGerais").removeClass("hide");
		}else if (aba == "dadosGerais"){
			$("#li-dadosGerais").removeClass("active");
			$("#dadosGerais").addClass("hide");
			
			$("#li-classeSocial").removeClass("hide");
			$("#li-classeSocial").addClass("active");
			$("#classeSocial").removeClass("hide");
		}
	}else {
		FLUIGIP.USEFUL.showError(result[1]);
	}
}

function vldCamposObrigatorios(aba){
	var obj = this;
	var isValidate = true;
	var messageAll = "Preencha os campos em vermelho.";
	var messageVld = "";
	var result =  [];

	$(".has-error").removeClass("has-error");
	$(".has-error-table").removeClass("has-error-table");

	$("."+aba).each(function(){
		var required;
		var conditional;

			if ($(this).attr("type") == "zoom"){
				required 	= $(this).parent("div").data("fluig-required");
				conditional = $(this).parent("div").data("fluig-conditional-valid");
			} else if($(this).attr("type") == "radio"){
				required 	= $(this).parent("label").parent("div").data("fluig-required");
				conditional = $(this).parent("label").parent("div").data("fluig-conditional-valid");
			} else if($(this).attr("type") == "checkbox"){
				required 	= $(this).closest(".input-group").data("fluig-required");
				conditional = $(this).closest(".input-group").data("fluig-conditional-valid");
			} else {
				required 	=  $(this).data("fluig-required");
				conditional =  $(this).data("fluig-conditional-valid");
			}
			var value    =  ($("#"+$(this).attr("id")).val() == null ? "" : $("#"+$(this).attr("id")).val().toString());

			var keep = FLUIGIP.validConditional(conditional);
			var validConditional = keep ? eval(conditional) : true ;

			if ( (typeof required != 'undefined') && (validConditional) ){
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
						}
					} else if($(this).attr("type") == "checkbox"){
						if (!$(this).prop("checked")){
							messageVld += "\n"
							isValidate = false;
							$(this).closest(".input-group").parent("div").addClass("has-error");
						}
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
}

function getDate() {
	var date = new Date();

	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();

	if (month < 10)
		month = "0" + month;
	if (day < 10)
		day = "0" + day;

	var today = day + "/" + month + "/" + year;

	return today;
}