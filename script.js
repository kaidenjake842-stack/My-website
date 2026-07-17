(function(){
  const search = document.getElementById('commandSearch');
  const clear = document.getElementById('clearSearch');
  const cards = Array.from(document.querySelectorAll('.command-card'));
  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const count = document.getElementById('resultCount');
  const empty = document.getElementById('emptyState');
  let activeCategory = 'all';

  function updateCommands(){
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const searchText = (card.dataset.search || '').toLowerCase();
      const matchText = !query || searchText.includes(query);
      const matchCategory =
        activeCategory === 'all' ||
        card.dataset.category === activeCategory;

      const show = matchText && matchCategory;
      card.classList.toggle('hidden', !show);

      if(show) {
        visible++;
      } else {
        card.open = false;
      }
    });

    count.textContent =
      visible + (visible === 1 ? ' command' : ' commands');

    empty.style.display = visible === 0 ? 'block' : 'none';
  }

  if (search && clear && count && empty) {
    search.addEventListener('input', updateCommands);

    clear.addEventListener('click', () => {
      search.value = '';
      search.focus();
      updateCommands();
    });

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.filter;
        filters.forEach(item =>
          item.classList.toggle('active', item === btn)
        );
        updateCommands();
      });
    });
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const original = btn.textContent;

      try {
        await navigator.clipboard.writeText(btn.dataset.copy || '');
        btn.textContent = 'Copied!';
      } catch {
        btn.textContent = 'Copy failed';
      }

      setTimeout(() => {
        btn.textContent = original;
      }, 1400);
    });
  });

  /* ==========================================
     MOTION BOT DIRECT INVITE LINK
  ========================================== */

  const MOTION_BOT_INVITE_LINK =
    "https://discord.com/oauth2/authorize?client_id=1527326573546700930&permissions=8&integration_type=0&scope=bot%20applications.commands";

  document.querySelectorAll('.invite-trigger').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = MOTION_BOT_INVITE_LINK;
    });
  });

  /* ==========================================
     PREMIUM BILLING TOGGLE
  ========================================== */

  const premiumPrice = document.getElementById('premiumPrice');
  const billingLabel = document.getElementById('billingLabel');
  const billingButtons = Array.from(
    document.querySelectorAll('.billing-btn')
  );

  billingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      billingButtons.forEach(item =>
        item.classList.toggle('active', item === btn)
      );

      if (!premiumPrice || !billingLabel) return;

      if(btn.dataset.billing === 'yearly') {
        premiumPrice.textContent = '$47.90';
        billingLabel.textContent = '/ year';
      } else {
        premiumPrice.textContent = '$4.99';
        billingLabel.textContent = '/ month';
      }
    });
  });

  const premiumModal = document.getElementById('premiumModal');
  const upgradeButton = document.getElementById('upgradeButton');
  const closePremium = document.getElementById('closePremium');

  if (premiumModal && upgradeButton && closePremium) {
    upgradeButton.addEventListener('click', () => {
      premiumModal.classList.add('show');
    });

    closePremium.addEventListener('click', () => {
      premiumModal.classList.remove('show');
    });

    premiumModal.addEventListener('click', event => {
      if(event.target === premiumModal) {
        premiumModal.classList.remove('show');
      }
    });
  }

  /* ==========================================
     CHANGELOG SEARCH
  ========================================== */

  const updateSearch = document.getElementById('updateSearch');
  const clearUpdates = document.getElementById('clearUpdates');
  const releaseCards = Array.from(
    document.querySelectorAll('.release-card')
  );
  const updateFilters = Array.from(
    document.querySelectorAll('[data-update-filter]')
  );
  const updateCount = document.getElementById('updateCount');
  const emptyUpdates = document.getElementById('emptyUpdates');
  let activeUpdateFilter = 'all';

  function updateReleases() {
    if (!updateSearch || !updateCount || !emptyUpdates) return;

    const query = updateSearch.value.trim().toLowerCase();
    let visible = 0;

    releaseCards.forEach(card => {
      const searchText = (card.dataset.search || '').toLowerCase();
      const types = (card.dataset.types || '').split(' ');

      const matchesText = !query || searchText.includes(query);
      const matchesType =
        activeUpdateFilter === 'all' ||
        types.includes(activeUpdateFilter);

      const show = matchesText && matchesType;
      card.classList.toggle('hidden', !show);

      if (show) visible++;
    });

    updateCount.textContent =
      visible + (visible === 1 ? ' release' : ' releases');

    emptyUpdates.style.display =
      visible === 0 ? 'block' : 'none';
  }

  if (updateSearch && clearUpdates) {
    updateSearch.addEventListener('input', updateReleases);

    clearUpdates.addEventListener('click', () => {
      updateSearch.value = '';
      updateSearch.focus();
      updateReleases();
    });

    updateFilters.forEach(button => {
      button.addEventListener('click', () => {
        activeUpdateFilter = button.dataset.updateFilter;

        updateFilters.forEach(item =>
          item.classList.toggle('active', item === button)
        );

        updateReleases();
      });
    });
  }

  /* ==========================================
     ROADMAP VOTING
  ========================================== */

  document.querySelectorAll('.vote-button').forEach(
    (button, index) => {
      const storageKey = 'motionRoadmapVote' + index;
      const votes =
        button.parentElement.querySelector('.votes');

      if (!votes) return;

      if (localStorage.getItem(storageKey) === 'true') {
        button.classList.add('voted');
        button.textContent = 'Voted';
      }

      button.addEventListener('click', () => {
        const alreadyVoted =
          localStorage.getItem(storageKey) === 'true';

        let total = Number(votes.textContent);

        if (alreadyVoted) {
          total = Math.max(0, total - 1);
          localStorage.removeItem(storageKey);
          button.classList.remove('voted');
          button.textContent = 'Vote';
        } else {
          total += 1;
          localStorage.setItem(storageKey, 'true');
          button.classList.add('voted');
          button.textContent = 'Voted';
        }

        votes.textContent = total;
      });
    }
  );

  if (search && clear && count && empty) {
    updateCommands();
  }

  if (updateSearch && updateCount && emptyUpdates) {
    updateReleases();
  }

  /* ==========================================
     SCROLL REVEAL
  ========================================== */

  const revealItems =
    document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver =
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

    revealItems.forEach(item =>
      revealObserver.observe(item)
    );
  } else {
    revealItems.forEach(item =>
      item.classList.add('visible')
    );
  }

  /* ==========================================
     MOTION BOT STATUS

     Change this one line:
     setBotStatus("online");
     setBotStatus("offline");
     setBotStatus("starting");
     setBotStatus("maintenance");
  ========================================== */

  const statusDot = document.getElementById('botStatusDot');
  const statusText = document.getElementById('botStatusText');
  const statusDetail =
    document.getElementById('botStatusDetail');

  function setBotStatus(status) {
    if (!statusDot || !statusText || !statusDetail) return;

    statusDot.className = 'live-dot';

    switch (status) {
      case 'online':
        statusDot.classList.add('status-online');
        statusText.textContent = 'Online';
        statusDetail.textContent = 'All systems operational';
        break;

      case 'offline':
        statusDot.classList.add('status-offline');
        statusText.textContent = 'Offline';
        statusDetail.textContent = 'Bot is currently unavailable';
        break;

      case 'starting':
        statusDot.classList.add('status-starting');
        statusText.textContent = 'Starting';
        statusDetail.textContent = 'Bot is connecting';
        break;

      case 'maintenance':
        statusDot.classList.add('status-maintenance');
        statusText.textContent = 'Maintenance';
        statusDetail.textContent = 'Scheduled maintenance';
        break;

      default:
        statusDot.classList.add('status-offline');
        statusText.textContent = 'Unknown';
        statusDetail.textContent = 'Status unavailable';
    }
  }

  // CHANGE THIS LINE TO CONTROL THE BOT STATUS:
  setBotStatus('offline');

})();

(function setupPremiumDurationPreview(){
  const cards =
    document.querySelectorAll('.premium-duration-card');
  const durationText =
    document.getElementById('premiumSelectedDuration');
  const priceText =
    document.getElementById('premiumSelectedPrice');
  const continueButton =
    document.getElementById('premiumBuyButton');

  if (
    !cards.length ||
    !durationText ||
    !priceText ||
    !continueButton
  ) return;

  const planLinks = {
    "1 Day": "https://example.com/motion-premium-1-day",
    "7 Days": "https://example.com/motion-premium-7-days",
    "30 Days": "https://example.com/motion-premium-30-days",
    "90 Days": "https://example.com/motion-premium-90-days",
    "1 Year": "https://example.com/motion-premium-1-year",
    "Lifetime": "https://example.com/motion-premium-lifetime"
  };

  let selectedPlan = "30 Days";

  function updateSelection(card){
    cards.forEach(item =>
      item.classList.remove('selected')
    );

    card.classList.add('selected');

    const input = card.querySelector('input');
    if (!input) return;

    input.checked = true;
    selectedPlan = input.value;

    durationText.textContent = input.value;
    priceText.textContent = input.dataset.price || '';
    continueButton.textContent =
      `Continue to ${input.value}`;
  }

  cards.forEach(card => {
    card.addEventListener('click', () =>
      updateSelection(card)
    );
  });

  continueButton.addEventListener('click', () => {
    const destination = planLinks[selectedPlan];

    if (!destination) {
      window.alert(
        'No link has been configured for this plan yet.'
      );
      return;
    }

    window.alert(
      `Preview only: this would open the ${selectedPlan} checkout.\n\n${destination}`
    );

    // Replace the alert above with:
    // window.location.href = destination;
  });
})();
