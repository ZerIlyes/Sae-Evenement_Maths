var pattern = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
let form = document.getElementById('form');

function onSubmit(){
    if(!document.getElementById('adresse').value.length==0){
        $_POST['etablissement']=document.getElementById('adresse').value;
    }

    if(!formTryMail()){
        event.preventDefault();
    }
    if(!formTryMdp()){
        event.preventDefault();
    }
    if(!formTryName()){
        event.preventDefault();
    }
    if(formTryMdp()){
        event.preventDefault();
    }
}



function selectOther(){
    $val = document.forms["form"]["etablissement"].value;
    if($val == 'other'){
        document.getElementById('adresseDiv').style.display='block';
    }
    else{
        document.getElementById('adresseDiv').style.display='none';
        document.getElementById('ville').value='';
        document.getElementById('cp').value='';
    }
}

function formTryMail(){
    var x = document.forms["form"]["mail"].value;
    form.addEventListener('keydown',formTryMail());
    if (pattern.test(x)){
        document.getElementById('alertMail').style.display='none';
        document.getElementById('mailInput').style.color='black';
        return true;
    }
    else{
        document.getElementById('alertMail').style.display='block';
        document.getElementById('mailInput').style.color='red';
        return false;
    }
}

function formTryMdp(){
    var mdp = document.forms["form"]["mdp"];
    var mdpConfirm = document.forms["form"]["mdp_retype"];
    if(mdp === mdpConfirm){
        return true;
    }
    document.getElementById('alertMdp').style.display='block';
    return false;
}

function formTryPseudo(){
    var x = document.forms["form"]["prenom"].value;
    if(x.length > 100 ){
        document.getElementById('alertPseudo').style.display='block';
        return false;
    }
    return true;
}

function formTryName(){
    var x = document.forms["form"]["nom"].value;
    if(x.length > 100 ){
        document.getElementById('alertPseudo').style.display='block';
        return false;
    }
    return true;
}

function showNewPassword(){
    let password= document.getElementById('pswd');
    if (password.type === "password"){
        password.type="text";
    }
    else{
        password.type="password";
    }
}

function showConfirmPassword(){
    let password= document.getElementById('confirmpswd');
    if (password.type === "password"){
        password.type="text";
    }
    else{
        password.type="password";
    }
}

function formTryPassword()
{
    let confirmMdp = document.forms["form"]["confirmpswd"].value;
    let newMdp = document.forms["form"]["pswd"].value;
  
    if(newMdp === confirmMdp)
  { 
    return true;
  }
    event.preventDefault(); 
    document.getElementById('alertMdp').style.display='block';
    document.getElementById('confirmpswd').style.color='red';
    return false;
}




/* Recherche d'adresse */

  var currentFocus = -1;
  var fetchTrigger = 0;

  // Fonction pour mettre en forme visuellement un r??sultat s??lectionn??
  function setActive() {
    var nbVal = $("div.address-feedback a").length;
    if (!nbVal)
      return false; // Si on n'a aucun r??sultat list??, on s'arr??te l??.
    // On commence par nettoyer une ??ventuelle s??lection pr??c??dente
    $('div.address-feedback a').removeClass("active");

    // Bidouille math??matique pour contraindre le focus dans la plage du nombre de r??sultats
    currentFocus = ((currentFocus + nbVal - 1) % nbVal) + 1;

    $('div.address-feedback a:nth-child(' + currentFocus + ')').addClass("active");
  }

  // Au clic sur une adresse sugg??r??e, on ventile l'adresse dans les champs appropri??s. On espionne mousedown plut??t que click pour l'attraper avant la perte de focus du champ adresse.
  $('div.address-feedback').on("mousedown", "a", function(event) {
    // Stop la propagation par d??faut
    event.preventDefault();
    event.stopPropagation();

    $("#adresse").val($(this).attr("data-name"));
    $("#cp").val($(this).attr("data-postcode"));
    $("#ville").val($(this).attr("data-city"));
    if($(".waiting")[0]){

      var option = '<option class="waiting" value="'+$(this).attr("data-name")+' - '+$(this).attr("data-city")+'">'+$(this).attr("data-postcode")+' - '+$(this).attr("data-city")+'</option>';
      $('.waiting').replaceWith(option);
    }
    else{
      var option = '<option class="waiting" value="'+$(this).attr("data-name")+' - '+$(this).attr("data-city")+'">'+$(this).attr("data-postcode")+' - '+$(this).attr("data-city")+'</option>';
      $('#etablissement').append(option);
    }
    
    $('.address-feedback').empty();
  });

  // On espionne le clavier dans le champ adresse pour d??clencher les actions qui vont bien
  $("#adresse").keyup(function(event) {
    // Stop la propagation par d??faut
    event.preventDefault();
    event.stopPropagation();

    if (event.keyCode === 38) { // Fl??che HAUT
      currentFocus--;
      setActive();
      return false;
    } else if (event.keyCode === 40) { // Fl??che BAS
      currentFocus++;
      setActive();
      return false;
    } else if (event.keyCode === 13) { // Touche ENTREE
      if (currentFocus > 0) {
        // On simule un clic sur l'??l??ment actif
        $("div.address-feedback a:nth-child(" + currentFocus + ")").mousedown();
      }
      return false;
    }

    // Si on arrive ici c'est que l'user a avanc?? dans la saisie : on r??initialise le curseur de s??lection.
    $('div.address-feedback a').removeClass("active");
    currentFocus = 0;

    // On annule une ??ventuelle pr??c??dente requ??te en attente
    clearTimeout(fetchTrigger);

    // Si le champ adresse est vide, on nettoie la liste des suggestions et on ne lance pas de requ??te.
    let rue = $("#adresse").val();
    if (rue.length === 0) {
      $('.address-feedback').empty();
      return false;
    }

    // On lance une minuterie pour une requ??te vers l'API.
    fetchTrigger = setTimeout(function() {
      // On lance la requ??te sur l'API
      $.get('https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre', {
        q: rue,
        limit: 15,
        autocomplete: 1
      }, function(data, status, xhr) {
        let liste = "";
        $.each(data.records, function(i, obj) {
          // donn??es phase 1 (obj.fields.label) & phase 2 : name, postcode, city
          // J'ajoute chaque ??l??ment dans une liste
          let madeaddress = obj.fields.appellation_officielle + " "  + obj.fields.adresse_uai + " "+  obj.fields.code_postal_uai +" <strong>" + obj.fields.libelle_commune + "</strong>";
          liste += '<a class="list-group-item list-group-item-action py-1" href="#" name="' + obj.fields.libelle_academie + '" data-name="' + obj.fields.appellation_officielle + '" data-postcode="' + obj.fields.code_postal_uai + '" data-adresse="' + obj.fields.adresse_uai +'" data-city="' + obj.fields.libelle_commune + '">' + madeaddress + '</a>';
        });
        $('.address-feedback').html(liste);
      }, 'json');
    }, 500);
  }); 

  // On cache la liste si le champ adresse perd le focus
  $("#adresse").focusout(function() {
    $('.address-feedback').empty();
  });

  // On annule le comportement par d??faut des touches entr??e et fl??ches si une liste de suggestion d'adresses est affich??e
  $("#adresse").keydown(function(e) {
    if ($("div.address-feedback a").length > 0 && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)) {
      e.preventDefault();
    }
  });