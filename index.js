(function() {
  'use strict';

  $('.button-collapse').sideNav();

  const clearSearch = function() {
    $('input[type=text], textarea').val('');
  };

  const getEvents = function(input) {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        const shows = state;
        const resultsDiv = $('.results');

        for (const show of shows) {
          const showDateTime = $('<h5>').text(show.formatted_datetime);
          const ticketStatus = `Tickets are ${show.ticket_status}.`;
          const ticketURL = show.ticket_url;
          const showLong = show.venue.longitude;
          const showLat = show.venue.latitude;
          const venueLink = $('<a>')
            .prop('href',
            `http://maps.google.com/maps?q=${showLat},${showLong}`)
            .prop('display', 'block')
            .text('Get Directions to the Venue');
          // const eventID = event.id;
          const ticketLink = $('<a>').prop('href', ticketURL)
            .css('id', 'venue-link')
            .text(ticketStatus);
          const collectionDiv = $('<ul>')
            .prop('class', 'collection with-header');
          const liHeader = $('<li>').prop('class', 'collection-header');
          const showTitle = $('<h4>');
          const showDateContainer = $('<li>').prop('class', 'collection-item');
          const showDirectionsContainer = $('<a>')
            .prop('class', 'collection-item')
            .prop('href', `http://maps.google.com/maps?q=${showLat},${showLong}`)
            .text('Directions to Venue');
          let ticketsAvailableContainer;

          show.ticket_url === null
          ? ticketsAvailableContainer = $('<li>').prop('href',
              show.ticket_url).prop('class',
              'collection-item').text(ticketStatus)
          : ticketsAvailableContainer = $('<a>').prop('href',
              show.ticket_url).prop('class',
              'collection-item').text('Buy Tickets');
          liHeader.append(showTitle);
          showDateContainer.text(show.formatted_datetime);
          showTitle.text(show.title);
          collectionDiv.append(liHeader)
          .append(showDateContainer)
          .append(ticketsAvailableContainer)
          .append(showDirectionsContainer);
          $('.results').append(collectionDiv);
          // console.log(event);
        }
      },
      dataType: 'jsonp'
    });
  };

  const getArtists = function(input) {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        if (!state.name) {
          Materialize.toast('Sorry, no match found.', 4000);
        }
        else {
          const h3 = $('<h3>').text(state.name);
          const resultsDiv = $('.results');
          const img = $('<img>').prop('src', state.thumb_url).css('class',
            'responsive-img');
          const fbTour = $('<a>').prop('href',
            state.facebook_tour_dates_url);
          const howManyEvents = $('<p>').text(`${state.name} has
            ${state.upcoming_event_count} upcoming events`);
          const fbPage = $('<a>').prop('href', state.facebook_page_url);

          fbTour.text('Facebook Tour Page');
          fbPage.text('Facebook Page');
          resultsDiv
          .append(h3)
          .append(img)
          .append(fbTour)
          .append(howManyEvents)
          .append(fbPage);
          console.log(state);
        }
      },
      dataType: 'jsonp'
    });
    getEvents(input);
  };

  $('#search').on('focus', () => {
    clearSearch();
  });

  $('#search').keyup((event) => {
    const code = event.which;
    const input = $('input').val();

    if (code === 13) {
      clearSearch();
      if (input.trim() === '' || input.trim() === 'Enter Your Search Here') {
        Materialize.toast('Please Enter an Artist or Group', 4000);

        return;
      }
      $('.results').empty();
      getArtists(input);
    }
  });

  $('.search-button').click(() => {
    const input = $('input').val();

    clearSearch();
    if (input.trim() === '' || input.trim() === 'Enter Your Search Here') {
      Materialize.toast('Please Enter an Artist or Group', 4000);

      return;
    }
    $('.results').empty();
    getArtists(input);
  });
})();
