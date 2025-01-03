     function onSignIn(googleUser) {
        // získame profil používateľa
        var profile = googleUser.getBasicProfile();

        console.log('Úplné meno: ' + profile.getName());
        console.log('Meno: ' + profile.getGivenName());
        console.log('Priezvisko: ' + profile.getFamilyName());
        console.log("Obrázok profilu: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // autorizačný token
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);

        // zmeníme content element
        document.querySelector("#content").innerHTML = "<p>Vitajte " + profile.getGivenName() + "! Kliknite pre <a href='#' onclick='signOut();'>odhlásenie</a>.</p>";
      }

      function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          alert("Boli ste odhlásený...");
          // znovu načítame stránku a zobrazíme tlačidlo pre prihlásenie
          location.reload();
        });
      }