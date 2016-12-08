(function() {
  'use strict';
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
  });
  $('select').material_select();

  const clearSearch = function() {
    $('#search-input[type=text], textarea').val('');
  };

  const renderEvents = function(state) {
    const shows = state;

    for (const show of shows) {
      console.log(show)

      const collectionDiv = $('<ul>')
        .prop('class', 'collection with-header center');
      const liHeader = $('<li>').prop('class', 'collection-header');
      let showTitle;
      const venue = $('<li>').prop('class', 'collection-header')
        .text(show.venue.place);
      const showDateContainer = $('<li>').prop('class', 'collection-item');
      const showDirectionsContainer = $('<a>')
        .prop({ class: 'collection-item', href: `http://maps.google.com/maps?q=${show.venue.latitude},${show.venue.longitude}`, text: 'Directions to Venue' });
      let ticketsAvailableContainer = $('<a>')
        .prop({ class: 'btn', href: show.ticket_url, text: 'Buy Tickets' });

      show.ticket_url === null
      ? ticketsAvailableContainer = $('<li>')
        .prop({
          class: 'collection-item'
        }).text(`Tickets are ${show.ticket_status}.`)
      : ticketsAvailableContainer = $('<li>')
        .prop({
          class: 'collection-item'
        }).append(ticketsAvailableContainer);

      showDateContainer.text(show.formatted_datetime);
      console.log(show.title.length);
      show.title.length > 35
        ? showTitle = $('<h4>').text(`${show.title.slice(0, 35)}...`)
        : showTitle = $('<h4>').text(show.title);
      liHeader.append(showTitle);
      console.log(showTitle)
      collectionDiv.append(liHeader)
      .append(showDateContainer)
      .append(venue)
      .append(ticketsAvailableContainer)
      .append(showDirectionsContainer);
      $('.results').append(collectionDiv);
    }
  };

  const getEvents = function(input) {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        renderEvents(state);
      },
      dataType: 'jsonp'
    });
  };

  const createProfile = function(state) {
    console.log(state)
    $('#profile').empty();
    const rowDiv = $('<div>').prop('class', 'row');
    const profileImg = $('<img>').prop({ src: state.thumb_url, class: 'profileImg' });
    const profileDiv = $('<ul>')
      .prop('class', 'collection with-header center');
    const profileHeader = $('<li>').prop('class', 'collection-header profileHeader')
    const artistTitle = $('<h5>').text(state.name);
    let detailsContainer;
    state.name.slice(-1) === 's' ? detailsContainer = $('<li>').prop('class', 'collection-item').text(`${state.name} Have ${state.upcoming_event_count} Shows`) : detailsContainer = $('<li>').prop('class', 'collection-item').text(`${state.name} Has ${state.upcoming_event_count} Upcoming Shows`);
    const linkContainer = $('<a>')
    .prop({ class: 'collection-item', href: state.facebook_page_url }).text('Facebook');
    const linkContainer2 = $('<a>').prop({ class: 'collection-item', href: state.facebook_tour_dates_url }).text('Tour Page');
    profileHeader.append(profileImg).append(artistTitle);
    profileDiv.append(profileHeader)
    .append(detailsContainer).append(linkContainer2)
    .append(linkContainer);
    rowDiv.append(profileDiv)
    $('#profile').append(rowDiv);
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
          createProfile(state);
        }
      },
      dataType: 'jsonp'
    });
    getEvents(input);
  };

  $('#search-input').on('focus', () => {
    clearSearch();
  });

  const advancedSearch = function(input) {
    const city = $('#city').val();
    const region = $('#state').val();
    const radius = $('#radius').val();

    if (input.trim() === '' || input.trim() === 'Artist or Group Name') {
      Materialize.toast('Please Enter an Artist or Group', 4000);

      return;
    }
    if (city.trim() === '') {
      Materialize.toast('Please Enter Your City', 4000);

      return;
    }
    if (region === null) {
      Materialize.toast('Please Select Your State', 4000);

      return;
    }
    if (radius === null) {
      Materialize.toast('Please Select How Far You Will Travel', 4000);

      return;
    }
    $('.results').empty();
    $('.artistName, .profile, .detailsDiv').empty();

    clearSearch();
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        if (!state.name) {
          Materialize.toast('Sorry, no match found.', 4000);
        }
        else {
          createProfile(state);
        }
      },
      dataType: 'jsonp'
    });
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events/search.json?api_version=2.0&app_id=michaelfriedman&location=${city},${region}&radius=${radius}`,
      success: (state) => {
        renderEvents(state);
      },
      dataType: 'jsonp'
    });
  };

  $('#search-input').keyup((event) => {
    const code = event.which;
    const input = $('#search-input').val();

    if (code === 13) {
      if ($('input:checkbox').is(':checked')) {
        advancedSearch(input);
      }
      else {
        $('.results').empty();
        $('.artistName, .profileDiv, .detailsDiv').empty();

        getArtists(input);
      }
    }
  });

  $('.search-button').click(() => {
    const input = $('#search-input').val();

    if (input.trim() === '' || input.trim() === 'Enter Your Search Here') {
      Materialize.toast('Please Enter an Artist or Group', 4000);

      return;
    }
    $('.results').empty();
    $('.artistName, .profileDiv, .detailsDiv').empty();
    clearSearch();
    getArtists(input);
  });

  $('#advanced-button').click(() => {
    const input = $('#search-input').val();

    advancedSearch(input);
  });

  $('input:checkbox').change(function() {
    if ($(this).is(':checked')) {
      $('#advanced').removeClass('hide');
      $('#advanced-button').removeClass('hide');
      $('#search-button').hide();
    }
    else {
      $('#search-button').show();
      $('#advanced').addClass('hide');
      $('#advanced-button').addClass('hide');
    }
  });
})();
