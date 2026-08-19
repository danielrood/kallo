(function () {
  function item(partial) {
    return Object.assign(
      {
        demo: true,
        accepted: false,
      },
      partial
    );
  }

  const PACKS = {
    locksmith: [
      item({
        id: "u1",
        urgency: 1,
        tag: "Urgent",
        caller: "Priya N.",
        line: "Locked out on the high street, child in the car",
        when: "4 min ago",
        phone: "07700 900141",
        summary:
          "Priya is locked out of a Ford Fiesta on Castle Street. Her daughter is in the car. She can wait on the pavement for 20 minutes. Asked for the fastest arrival, not the cheapest.",
        quote: { title: "Emergency vehicle unlock", amount: "£85", note: "Call-out + non-destructive entry" },
        callback: "Now — she is on site",
      }),
      item({
        id: "q1",
        urgency: 2,
        tag: "Quote",
        caller: "Owen Hale",
        line: "Wants a price to rekey the shop shutters",
        when: "22 min ago",
        phone: "01632 960218",
        summary:
          "Owen runs the unit two doors down. Three shutter locks stick and he wants them rekeyed this week before a stock delivery on Thursday.",
        quote: { title: "Rekey 3 shutter locks", amount: "£160", note: "Labour + barrels, midweek slot" },
        callback: "Today after 16:00",
      }),
      item({
        id: "n1",
        urgency: 3,
        tag: "Callback",
        caller: "Marta Cole",
        line: "Spare Yale for the flat above the shop",
        when: "1 hr ago",
        phone: "07700 900274",
        summary:
          "Marta needs a spare key cut from a worn Yale. She can bring the original tomorrow morning if you have a 10-minute counter slot.",
        quote: null,
        callback: "Tomorrow 09:30–11:00",
      }),
    ],
    plumber: [
      item({
        id: "u1",
        urgency: 1,
        tag: "Urgent",
        caller: "Tom Reid",
        line: "Stopcock failed, water under the kitchen units",
        when: "6 min ago",
        phone: "07700 900118",
        summary:
          "Tom shut the mains at the boundary. Water is still weeping under the kitchen run. He is home now and can stay until 18:00. Asked you to bring a replacement stopcock.",
        quote: { title: "Emergency stopcock + dry-down visit", amount: "£190", note: "Includes first hour on site" },
        callback: "Now — he is waiting in",
      }),
      item({
        id: "q1",
        urgency: 2,
        tag: "Quote",
        caller: "Helen Park",
        line: "Quote for swapping a leaking bath tap",
        when: "35 min ago",
        phone: "01632 960334",
        summary:
          "Helen sent a photo of a dripping bath filler. Access is fine. She wants it done before the weekend if the price holds.",
        quote: { title: "Replace bath filler", amount: "£145", note: "Tap supplied by you, mid-range" },
        callback: "Today 17:00–18:00",
      }),
      item({
        id: "n1",
        urgency: 3,
        tag: "Callback",
        caller: "Ibrahim S.",
        line: "Wants the annual cylinder check moved",
        when: "2 hr ago",
        phone: "07700 900309",
        summary:
          "Ibrahim cannot do Thursday. He asked for Friday after school run, around 15:30. No leak, just the booked service.",
        quote: null,
        callback: "Friday from 15:30",
      }),
    ],
    garage: [
      item({
        id: "u1",
        urgency: 1,
        tag: "Urgent",
        caller: "Jess Adeyemi",
        line: "Van failed its MOT — wants same-week repair",
        when: "9 min ago",
        phone: "07700 900552",
        summary:
          "Jess needs the van for Friday deliveries. MOT failed on front pads and a headlight aim. She can leave it tomorrow if you have a loaner or a late collection.",
        quote: { title: "Pads + lamp aim", amount: "£220", note: "Parts on the shelf, one day" },
        callback: "Today before close",
      }),
      item({
        id: "q1",
        urgency: 2,
        tag: "Quote",
        caller: "Neil Cartwright",
        line: "Clutch quote on a 2016 Golf",
        when: "41 min ago",
        phone: "01632 960441",
        summary:
          "Neil described a high biting point and a smell after hills. He wants a written figure before he books the car in next week.",
        quote: { title: "Clutch kit + labour", amount: "£680", note: "2 days, courtesy car not included" },
        callback: "Tomorrow morning",
      }),
      item({
        id: "n1",
        urgency: 3,
        tag: "Callback",
        caller: "Ruth Bell",
        line: "Service reminder — asks if Thursday still stands",
        when: "3 hr ago",
        phone: "07700 900613",
        summary:
          "Ruth is confirming the 09:15 service. She asked you to check the air-con while it is up. No warning lights.",
        quote: null,
        callback: "Thursday 09:15",
      }),
    ],
    salon: [
      item({
        id: "u1",
        urgency: 1,
        tag: "Urgent",
        caller: "Amelia K.",
        line: "Colour job tomorrow — allergic reaction last time",
        when: "11 min ago",
        phone: "07700 900771",
        summary:
          "Amelia is booked tomorrow at 10:00. She had a scalp reaction in March and wants a patch test confirmed before she travels in.",
        quote: { title: "Patch test + colour slot", amount: "£78", note: "Hold the chair until 10:20" },
        callback: "Today by 17:00",
      }),
      item({
        id: "q1",
        urgency: 2,
        tag: "Quote",
        caller: "Chris Dolan",
        line: "Wedding party — four cuts on Saturday",
        when: "50 min ago",
        phone: "01632 960802",
        summary:
          "Chris wants four men’s cuts before a 14:00 ceremony. Two of them are first-time clients. He asked for a package price.",
        quote: { title: "Wedding morning, 4 cuts", amount: "£140", note: "08:30 arrival, 90 minutes" },
        callback: "Tonight after 19:00",
      }),
      item({
        id: "n1",
        urgency: 3,
        tag: "Callback",
        caller: "Sana R.",
        line: "Move blow-dry from Wednesday to Friday",
        when: "2 hr ago",
        phone: "07700 900804",
        summary:
          "Sana can do Friday at 12:45 instead of Wednesday. Same stylist if possible, otherwise any senior.",
        quote: null,
        callback: "Friday 12:45",
      }),
    ],
    cafe: [
      item({
        id: "u1",
        urgency: 1,
        tag: "Urgent",
        caller: "Borough Hall",
        line: "Tomorrow’s tray bake order — need a headcount change",
        when: "8 min ago",
        phone: "01632 960910",
        summary:
          "The hall doubled a booking. They now need 40 portions, not 24, ready for 09:30 collection. They can pay on account.",
        quote: { title: "40 tray bakes, morning collect", amount: "£96", note: "Same menu as last month" },
        callback: "Today by 16:00",
      }),
      item({
        id: "q1",
        urgency: 2,
        tag: "Quote",
        caller: "Leah Grant",
        line: "Saturday hire of the back room",
        when: "28 min ago",
        phone: "07700 900922",
        summary:
          "Leah wants the back room for a birthday tea, 12 people, 14:00–16:00. Asked if you still do the set afternoon menu.",
        quote: { title: "Back room + set tea", amount: "£180", note: "Includes pot service, not cake" },
        callback: "Tomorrow lunchtime",
      }),
      item({
        id: "n1",
        urgency: 3,
        tag: "Callback",
        caller: "Dan Whitaker",
        line: "Allergy question on the soup of the day",
        when: "1 hr ago",
        phone: "07700 900933",
        summary:
          "Dan asked whether today’s soup is nut-free. He will call back if he does not hear by late afternoon.",
        quote: null,
        callback: "This afternoon",
      }),
    ],
  };

  PACKS.electrician = [
    item({
      id: "u1",
      urgency: 1,
      tag: "Urgent",
      caller: "Nora Blake",
      line: "No power to the shop fridge circuit",
      when: "5 min ago",
      phone: "07700 900201",
      summary:
        "Nora tripped a breaker after a freezer was plugged into the counter run. Fridge is warming. She can meet you at the rear door now.",
      quote: { title: "Fault find + isolate fridge circuit", amount: "£130", note: "First hour, parts extra" },
      callback: "Now — rear door unlocked",
    }),
    item({
      id: "q1",
      urgency: 2,
      tag: "Quote",
      caller: "Gareth Moon",
      line: "Quote for extra sockets in the stock room",
      when: "33 min ago",
      phone: "01632 960255",
      summary:
        "Gareth wants two double sockets and a fused spur for a label printer. Walls are plasterboard. He asked for an evening fit.",
      quote: { title: "2 sockets + fused spur", amount: "£240", note: "Evening call-out included" },
      callback: "Tonight after 18:30",
    }),
    item({
      id: "n1",
      urgency: 3,
      tag: "Callback",
      caller: "Patel News",
      line: "PAT test reminder for the kettle and microwave",
      when: "2 hr ago",
      phone: "07700 900266",
      summary:
        "They asked if you still do a counter-appliance PAT drop-in on Wednesdays. Five items, all in the back.",
      quote: null,
      callback: "Wednesday morning",
    }),
  ];

  PACKS.shop = [
    item({
      id: "u1",
      urgency: 1,
      tag: "Urgent",
      caller: "Cara Flynn",
      line: "Click-and-collect not ready and she is outside",
      when: "3 min ago",
      phone: "07700 900101",
      summary:
        "Cara is parked on double yellows with a collect order from this morning. She can wait four minutes. Asked you to bring it to the door.",
      quote: null,
      callback: "Now — she is outside",
    }),
    item({
      id: "q1",
      urgency: 2,
      tag: "Quote",
      caller: "St Mark’s PTA",
      line: "Bulk order for the Saturday fair",
      when: "27 min ago",
      phone: "01632 960102",
      summary:
        "The PTA wants a written price for 30 gift bags, collection Friday 16:00. They can pay by invoice to the school office.",
      quote: { title: "30 gift bags, Friday collect", amount: "£210", note: "Same mix as last term" },
      callback: "Today after 15:00",
    }),
    item({
      id: "n1",
      urgency: 3,
      tag: "Callback",
      caller: "Ben Law",
      line: "Opening hours on bank holiday Monday",
      when: "1 hr ago",
      phone: "07700 900103",
      summary:
        "Ben asked if you are open bank holiday Monday and whether the repair counter still closes at 13:00.",
      quote: null,
      callback: "Anytime today",
    }),
  ];

  PACKS.builder = PACKS.plumber;
  PACKS.roofer = PACKS.plumber;
  PACKS.painter = PACKS.plumber;
  PACKS.bakery = PACKS.cafe;
  PACKS.butcher = PACKS.shop;
  PACKS.florist = PACKS.shop;
  PACKS.vet = PACKS.shop;
  PACKS.dentist = PACKS.salon;

  function forTrade(tradeId) {
    const pack = PACKS[tradeId] || PACKS.shop;
    return pack
      .map(function (row) {
        return Object.assign({}, row, {
          quote: row.quote ? Object.assign({}, row.quote) : null,
        });
      })
      .sort(function (a, b) {
        return a.urgency - b.urgency;
      });
  }

  window.kalloDemo = { forTrade: forTrade };
})();
