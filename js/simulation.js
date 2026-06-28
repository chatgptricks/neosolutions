(() => {
  const demo = document.querySelector(".demo");
  if (!demo) return;

  // Enable interactive animations styling
  demo.classList.add("demo--interactive");

  // Element references
  const igBadge = document.getElementById("ig-badge");
  const msg1 = document.getElementById("msg-1");
  const msg2 = document.getElementById("msg-2");
  const msg3 = document.getElementById("msg-3");
  const msg4 = document.getElementById("msg-4");
  
  const chatStatus = document.getElementById("chat-status");
  const statusSpark = document.getElementById("status-spark");
  const statusText = document.getElementById("status-text");

  const qualStatusCard = document.getElementById("qual-status-card");
  const qualGoal = document.getElementById("qual-goal");
  const qualBudget = document.getElementById("qual-budget");
  const qualTimeline = document.getElementById("qual-timeline");
  const qualSource = document.getElementById("qual-source");

  const bookingCard = document.getElementById("booking-card");
  const bookingBtn = document.getElementById("booking-btn");

  const messagesContainer = document.querySelector(".messages");

  // Keep scroll synced
  const scrollChat = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  // Pull translated strings from global namespace defined in lang.js
  const t = (key) => window.strings ? window.strings[window.currentLang || 'en'][key] : key;

  let timeouts = [];

  const startDemoSimulation = () => {
    // Reset elements
    timeouts.forEach(clearTimeout);
    timeouts = [];

    igBadge.textContent = t('igBadgeVal7');
    igBadge.classList.remove("is-flashing");

    const elementsToHide = [
      msg1, msg2, msg3, msg4, 
      qualStatusCard, qualGoal, qualBudget, qualTimeline, qualSource, 
      bookingCard
    ];
    elementsToHide.forEach(el => el.classList.remove("is-visible"));

    // Reset status
    statusText.textContent = t('visitorWaiting');
    statusSpark.style.background = "radial-gradient(circle, #f5f8ff 0 20%, #7183a8 60%, transparent 70%)";
    statusSpark.style.boxShadow = "0 0 12px rgba(168, 182, 212, 0.4)";
    chatStatus.style.opacity = "1";

    bookingBtn.textContent = t('callBookedComplete'); // matches initial label
    bookingBtn.style.background = "linear-gradient(135deg, rgba(52, 105, 250, 0.96), rgba(31, 94, 255, 0.78))";
    bookingBtn.style.boxShadow = "0 16px 34px rgba(31, 94, 255, 0.34)";

    // Timeline execution
    // 1. Emma Johnson enters, Instagram badge flashes and increments (t = 1.0s)
    timeouts.push(setTimeout(() => {
      igBadge.classList.add("is-flashing");
      igBadge.textContent = t('igBadgeVal8');
      statusText.textContent = t('userTyping');
    }, 1000));

    // 2. msg1 (incoming) slides in (t = 2.0s)
    timeouts.push(setTimeout(() => {
      igBadge.classList.remove("is-flashing");
      msg1.classList.add("is-visible");
      scrollChat();
      statusText.textContent = t('neoResponding');
      statusSpark.style.background = "radial-gradient(circle, #4be2ff 0 20%, #1f5eff 60%, transparent 70%)";
      statusSpark.style.boxShadow = "0 0 18px rgba(31, 94, 255, 0.7)";
    }, 2000));

    // 3. msg2 (outgoing) slides in, Instagram badge resets, Source is qualified (t = 4.0s)
    timeouts.push(setTimeout(() => {
      msg2.classList.add("is-visible");
      scrollChat();
      igBadge.textContent = t('igBadgeVal7');
      qualSource.classList.add("is-visible");
      statusText.textContent = t('awaitingReply');
      statusSpark.style.background = "radial-gradient(circle, #f5f8ff 0 20%, #7183a8 60%, transparent 70%)";
      statusSpark.style.boxShadow = "0 0 12px rgba(168, 182, 212, 0.4)";
    }, 4000));

    // 4. Emma johnson types (t = 5.8s)
    timeouts.push(setTimeout(() => {
      statusText.textContent = t('userTyping');
    }, 5800));

    // 5. msg3 (incoming) slides in (t = 7.2s)
    timeouts.push(setTimeout(() => {
      msg3.classList.add("is-visible");
      scrollChat();
      statusText.textContent = t('neoQualifying');
      statusSpark.style.background = "radial-gradient(circle, #dcbaff 0 20%, #7b5cff 60%, transparent 70%)";
      statusSpark.style.boxShadow = "0 0 18px rgba(165, 120, 255, 0.7)";
    }, 7200));

    // 6. msg4 (outgoing) slides in, qualifications pop up (t = 9.2s)
    timeouts.push(setTimeout(() => {
      msg4.classList.add("is-visible");
      scrollChat();
      statusText.textContent = t('qualifyingLead');
    }, 9200));

    // 7. Qual goal (t = 9.9s)
    timeouts.push(setTimeout(() => {
      qualGoal.classList.add("is-visible");
    }, 9900));

    // 8. Qual budget (t = 10.5s)
    timeouts.push(setTimeout(() => {
      qualBudget.classList.add("is-visible");
    }, 10500));

    // 9. Qual timeline (t = 11.1s)
    timeouts.push(setTimeout(() => {
      qualTimeline.classList.add("is-visible");
    }, 11100));

    // 10. Lead status qualified lights up (t = 11.7s)
    timeouts.push(setTimeout(() => {
      qualStatusCard.classList.add("is-visible");
    }, 11700));

    // 11. Booking Card slides in (t = 12.7s)
    timeouts.push(setTimeout(() => {
      bookingCard.classList.add("is-visible");
      bookingBtn.textContent = t('bookingCall');
    }, 12700));

    // 12. Call booked completed (t = 14.0s)
    timeouts.push(setTimeout(() => {
      bookingBtn.textContent = t('callBookedComplete');
      bookingBtn.style.background = "linear-gradient(135deg, #24d366, #128c7e)";
      bookingBtn.style.boxShadow = "0 16px 34px rgba(36, 211, 102, 0.34)";
      statusText.textContent = t('leadQualifiedBooked');
      statusSpark.style.background = "radial-gradient(circle, #b9ffdf 0 20%, #24d366 60%, transparent 70%)";
      statusSpark.style.boxShadow = "0 0 18px rgba(36, 211, 102, 0.7)";
    }, 14000));

    // 13. Loop back (t = 20.0s)
    timeouts.push(setTimeout(() => {
      startDemoSimulation();
    }, 20000));
  };

  // Listen for language change to restart simulation in the correct language
  window.addEventListener('lang-change', () => {
    startDemoSimulation();
  });

  // Start initial simulation
  startDemoSimulation();
})();
