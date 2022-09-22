$(() => {
  window.propertyListing = {};


  function createListing(property, isReservation) {



    let $listing = (`
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation ?
        `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>`
        : ``}
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night / 100.0}/night</div>


            <button class= "open-button" onclick ="openForm(${property.id})">BOOK RESERVATION</button>

            <div class="form-popup" id="${property.id}">
            <form class="form-container" id="${property.id}form">
                <input type="hidden" value="${property.id}" name="property_id"/>
                <label for="start_date">Start date: </label>
                <input type="date" id="start" name ="start_date" required>
                <label for="end_date">End date: </label>
                <input type="date" id="end" name ="end_date" required>
                <button type="submit" class="btnSubmit">Reserve now</button>
                <button type="button" class="btn cancel" onclick="closeForm(${property.id})">Close</button>
              </form>
              <h3>congrats!</h3>
            </div>
            <script>
            function openForm(id) {
              document.getElementById(id).style.display = "block";
            };


            $("#${property.id}").submit(function (e) { 
              e.preventDefault();
              $.ajax({
                url: "/api/reservations",
                method:"POST",
                data: $("#${property.id}form").serialize(),
              }).done(()=>{
                closeForm(${property.id})
                success: alert("Success")
              })
              
            });
            

            
        
            function closeForm(id) {
              document.getElementById(id).style.display = "none";
            }
            </script>


          </footer>
        </section>
      </article>
    `)

    return $listing;
  };


  window.propertyListing.createListing = createListing;

});