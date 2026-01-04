// Simple client-side i18n (EN/UZ/RU) for static HTML pages
(function () {
  const translations = {
    en: {
      // NAV
      nav_how: 'How it works',
      nav_features: 'Features',
      nav_access: 'Early Access',
      nav_dashboard: 'Dashboard',
      nav_manage: 'Manage Queue',
      nav_analytics: 'Analytics',
      nav_logout: 'Logout',
      nav_back: '← Back',

      // LOGIN
      login_title: 'Staff Login',
      login_subtitle: 'Sign in to manage the queue',
      login_email: 'Email',
      login_password: 'Password',
      login_btn: 'Log In',
      login_error: 'Invalid login. Please try again.',
      footer_staff: 'QueueLeaf · Staff Portal',

      // JOIN
      join_welcome: 'Welcome',
      join_prompt: 'Please enter your info to join the queue.',
      join_name: 'Your name',
      join_name_ph: 'e.g., Alex',
      join_party: 'Party size',
      join_contact: 'Phone or email (optional)',
      join_contact_ph: 'For notifications',
      join_btn: 'Join Queue',
      join_terms: 'By joining, you agree to receive on-site updates. No apps needed.',
      privacy_title: 'Privacy Notice',
      privacy_body:
        'Your information (name and contact details) is used only for managing your place in line. After your visit, your personal data is anonymized. Anonymous queue activity may be retained for analytics purposes.',
      privacy_accept: 'I Understand & Agree',
      footer_customer: 'QueueLeaf · Customer Portal',

      // STATUS
      status_title: 'Queue Status',
      status_your_number: 'Your number',
      status_position: 'Position',
      status_est_wait: 'Est. Wait',
      status_leave: 'Leave Queue',
      status_refresh: 'Refresh',
      status_called_banner: 'You are being called! Please return to the host stand.',
      status_your_position: 'Your Position',
      status_estimated_wait: 'Estimated Wait',
      status_queue_overview: 'Queue Overview',
      status_privacy_policy: 'Privacy & Data Policy',
      status_wait_msg: 'Please wait until your name is called.',
      status_refresh_btn: 'Refresh Status',
      status_play_game: 'Play a quick game',
      // Status pill labels
      status_waiting: 'Waiting',
      status_called: 'Called',
      status_served: 'Served',
      status_left: 'Left',
      // Controls
      enable_sound_alerts: 'Enable Sound Alerts',
      footer_customer_status: 'QueueLeaf · Customer Status',
      modal_queue_overview: 'Queue Overview',
      modal_queue_label: 'Queue',
      modal_people_ahead: 'People Ahead',
      modal_avg_service: 'Avg Service Time',
      modal_queue: 'Queue',
      modal_people_ahead: 'People Ahead',
      modal_avg_service: 'Avg Service Time',

      // DASHBOARD / MANAGE
      dash_title: 'Dashboard',
      dash_current_queue: 'Current Queue',
      dash_call_next: 'Call Next',
      dash_mark_served: 'Mark Served',
      dash_remove: 'Remove / No-Show',
      dash_close_queue: 'Close Queue',
      dash_open_queue: 'Open Queue',
      footer_manager_dashboard: 'QueueLeaf · Manager Dashboard',
      manage_cancel: 'Cancel',
      manage_save: 'Save Changes',

      // Left-column summary labels (Manage Queue)
      summary_status: 'Status',
      summary_waiting: 'Waiting',
      summary_served_today: 'Served Today',

      // ANALYTICS
      analytics_title: 'Analytics',
      footer_analytics_dashboard: 'QueueLeaf · Analytics Dashboard',
      // Analytics page specific
      date_range_7: 'Last 7 Days',
      date_range_14: 'Last 14 Days',
      date_range_30: 'Last 30 Days',
      date_range_custom: 'Custom Range',
      apply_button: 'Apply',
      live_refresh_label: 'Enable Live Refresh (Every 10 Seconds)',
      total_tickets: 'Total Tickets',
      served: 'Served',
      total_queues: 'Total Queues',
      served_left_trend: 'Served/Left Trend',
      avg_wait_time: 'Avg Wait Time',
      peak_day_of_week: 'Peak Day of Week',
      heatmap_peak_hours: 'Heatmap: Peak Hours',
      axis_served: 'X: Days • Y: Customers Served/Left',
      axis_wait: 'X: Days • Y: Avg Wait (minutes)',
      axis_peak: 'X: Weekday • Y: Customers Visited',
      axis_heatmap: 'X: Hour of Day (0–23) • Y: Day of Week',
      heatmap_legend: 'Darker colors = higher volume',
      chart_label_served: 'Served',
      chart_label_left: 'Left Queue',
      chart_label_avg_wait: 'Avg Wait (min)',
      chart_label_customers: 'Customers',
      select_range_placeholder: 'Select range',
      // Additional keys added for dashboard/manage pages + JS
      create_new_queue: 'Create New Queue',
      your_queues: 'Your Queues',
      new_queue_btn: '+ New Queue',
      queue_name_label: 'Queue Name',
      queue_name_ph: 'e.g., Main Dining',
      avg_service_label: 'Average Service Time (min)',
      queue_qr_title: 'Queue QR Code',
      qr_close: 'Close',
      qr_download: 'Download PNG',
      no_queues_created: 'No queues created yet',
      create_queue_short: '+ Create Queue',
      manage_label: 'Manage',
      qr_label: 'QR',
      delete_label: 'Delete',
      status_open: 'Open',
      status_closed: 'Closed',
      confirm_delete_queue: 'Are you sure you want to delete this queue?',
      confirm_force_delete: 'This queue has tickets. Force delete?',
      queue_name_required: 'Queue name is required.',
      create_failed: 'Failed to create queue. Check console.',
      active_tickets: 'Active Tickets',
      table_name: 'Name',
      table_party: 'Party',
      table_status: 'Status',
      table_joined: 'Joined',
      table_called: 'Called',
      table_served: 'Served',
      table_left: 'Left',
      table_contact: 'Contact',
      table_actions: 'Actions',
      open_controls: 'Open Controls',
      queue_controls: 'Queue Controls',
      toggle_open_close: 'Toggle Open/Close',
      custom_message: 'Custom Message',
      call_next: 'Call Next',
      create_button: 'Create',
      empty_create_hint: 'Click the button above to create your first queue.',
    },

    uz: {
      // NAV
      nav_how: 'Qanday ishlaydi',
      nav_features: 'Imkoniyatlar',
      nav_access: 'Erta kirish',
      nav_dashboard: 'Panel',
      nav_manage: 'Navbatni boshqarish',
      nav_analytics: 'Analitika',
      nav_logout: 'Chiqish',
      nav_back: '← Orqaga',

      // LOGIN
      login_title: 'Xodimlar kirishi',
      login_subtitle: 'Navbatni boshqarish uchun tizimga kiring',
      login_email: 'Email',
      login_password: 'Parol',
      login_btn: 'Kirish',
      login_error: 'Login noto‘g‘ri. Qayta urinib ko‘ring.',
      footer_staff: 'QueueLeaf · Xodimlar portali',

      // JOIN
      join_welcome: 'Xush kelibsiz',
      join_prompt: "Navbatga qo‘shilish uchun ma’lumotlaringizni kiriting.",
      join_name: 'Ismingiz',
      join_name_ph: 'masalan, Ali',
      join_party: 'Guruh soni',
      join_contact: 'Telefon yoki email (ixtiyoriy)',
      join_contact_ph: 'Bildirishnomalar uchun',
      join_btn: "Navbatga qo‘shilish",
      join_terms: 'Qo‘shilish orqali joyidagi yangilanishlarni qabul qilishga rozilik bildirasiz. Ilova kerak emas.',
      privacy_title: 'Maxfiylik eslatmasi',
      privacy_body:
        "Ma’lumotlaringiz (ism va aloqa) faqat navbatdagi o‘rningizni boshqarish uchun ishlatiladi. Tashrifdan so‘ng shaxsiy ma’lumotlar anonimlashtiriladi. Anonim navbat faolligi analitika uchun saqlanishi mumkin.",
      privacy_accept: 'Tushundim va roziman',
      footer_customer: 'QueueLeaf · Mijoz portali',

      // STATUS
      status_title: 'Navbat holati',
      status_your_number: 'Sizning raqamingiz',
      status_position: "O‘rin",
      status_est_wait: 'Taxm. kutish',
      status_leave: 'Navbatdan chiqish',
      status_refresh: 'Yangilash',
      status_called_banner: 'Sizni chaqirishyapti! Iltimos, qaytib keling.',
      status_your_position: "Sizning o‘rningiz",
      status_estimated_wait: 'Taxminiy kutish',
      status_queue_overview: 'Navbat ko‘rinishi',
      status_privacy_policy: 'Maxfiylik va ma’lumot siyosati',
      status_wait_msg: "Ismingiz chaqirilguncha kuting.",
      status_refresh_btn: 'Holatni yangilash',
      status_play_game: "Zerikdingizmi? O'yin o'ynab turing!",
      // Status pill labels (UZ)
      status_waiting: 'Kutmoqda',
      status_called: 'Chaqirildi',
      status_served: 'Xizmat qilingan',
      status_left: 'Chiqib ketdi',
      // Controls
      enable_sound_alerts: 'Tovushli ogohlantirishlarni yoqish',
      footer_customer_status: 'QueueLeaf · Mijoz holati',
      modal_queue_overview: 'Navbat ko‘rinishi',
      modal_queue_label: 'Navbat',
      modal_people_ahead: "Oldingizdagi odamlar",
      modal_avg_service: "O‘rtacha xizmat vaqti",
      modal_queue: 'Navbat',
      modal_people_ahead: 'Oldingizdagi odamlar',
      modal_avg_service: 'O‘rtacha xizmat vaqti',

      // DASHBOARD / MANAGE
      dash_title: 'Panel',
      dash_current_queue: 'Joriy navbat',
      dash_call_next: 'Keyingisini chaqirish',
      dash_mark_served: 'Yakunlandi',
      dash_remove: "O‘chirish / Kelmagan",
      dash_close_queue: 'Navbatni yopish',
      dash_open_queue: 'Navbatni ochish',
      footer_manager_dashboard: 'QueueLeaf · Menejer paneli',
      manage_cancel: 'Bekor qilish',
      manage_save: 'O‘zgarishlarni saqlash',

      // Left-column summary labels (Manage Queue)
      summary_status: 'Holat',
      summary_waiting: 'Kutmoqda',
      summary_served_today: 'Bugun xizmat qilingan',

      // ANALYTICS
      analytics_title: 'Analitika',
      footer_analytics_dashboard: 'QueueLeaf · Analitika paneli',
      // Analytics page specific (UZ)
      date_range_7: 'So‘nggi 7 kun',
      date_range_14: 'So‘nggi 14 kun',
      date_range_30: 'So‘nggi 30 kun',
      date_range_custom: 'Maxsus oraliq',
      apply_button: 'Qo‘llash',
      live_refresh_label: 'Jonli yangilashni yoqish (har 10 soniyada)',
      total_tickets: 'Jami chiptalar',
      served: 'Xizmat qilingan',
      total_queues: 'Jami navbatlar',
      served_left_trend: 'Xizmat qilingan / Chiqdi trendlari',
      avg_wait_time: 'O‘rtacha kutish vaqti',
      peak_day_of_week: 'Haftaning eng band kuni',
      heatmap_peak_hours: 'Issiqlik xaritasi: Eng band soatlar',
      axis_served: 'X: Kunlar • Y: Xizmat qilingan/ketgan mijozlar',
      axis_wait: 'X: Kunlar • Y: O‘rtacha kutish (daqiqa)',
      axis_peak: 'X: Hafta kuni • Y: Kelgan mijozlar',
      axis_heatmap: 'X: Kun soati (0–23) • Y: Haftaning kuni',
      heatmap_legend: 'Qorong‘i ranglar = yuqori hajm',
      chart_label_served: 'Xizmat qilingan',
      chart_label_left: 'Navbatdan chiqdi',
      chart_label_avg_wait: 'O‘rtacha kutish (daq)',
      chart_label_customers: 'Mijozlar',
      select_range_placeholder: 'Oraliqni tanlang',
      // Additional keys for dashboard/manage pages + JS (UZ)
      create_new_queue: 'Yangi navbat yaratish',
      your_queues: 'Sizning navbatlaringiz',
      new_queue_btn: '+ Yangi navbat',
      queue_name_label: 'Navbat nomi',
      queue_name_ph: 'masalan, Main Dining',
      avg_service_label: 'O‘rtacha xizmat vaqti (daq)',
      queue_qr_title: 'Navbat QR-kodi',
      qr_close: 'Yopish',
      qr_download: 'PNG ni yuklab olish',
      no_queues_created: 'Hozirgacha navbatlar yaratilmagan',
      create_queue_short: '+ Navbat yaratish',
      manage_label: 'Boshqarish',
      qr_label: 'QR',
      delete_label: 'O‘chirish',
      status_open: 'Ochilgan',
      status_closed: 'Yopilgan',
      confirm_delete_queue: 'Ushbu navbatni o‘chirishni xohlaysizmi?',
      confirm_force_delete: 'Bu navbatda chiptalar mavjud. Majburiy o‘chirish?',
      queue_name_required: 'Navbat nomi talab qilinadi.',
      create_failed: 'Navbat yaratilmadi. Konsolni tekshiring.',
      active_tickets: 'Faol chiptalar',
      table_name: 'Ism',
      table_party: 'Guruh',
      table_status: 'Holat',
      table_joined: 'Qo‘shildi',
      table_called: 'Chaqirilgan',
      table_served: 'Xizmat qilingan',
      table_left: 'Ketdi',
      table_contact: 'Aloqa',
      table_actions: 'Harakatlar',
      open_controls: 'Boshqaruvni ochish',
      queue_controls: 'Navbat boshqaruvi',
      toggle_open_close: 'Ochish/Yopish',
      custom_message: 'Maxsus xabar',
      call_next: 'Keyingisini chaqirish',
      create_button: 'Yaratish',
      empty_create_hint: 'Yuqoridagi tugmani bosib birinchi navbatni yarating.',
    },

    ru: {
      // NAV
      nav_how: 'Как это работает',
      nav_features: 'Функции',
      nav_access: 'Ранний доступ',
      nav_dashboard: 'Панель',
      nav_manage: 'Управление очередью',
      nav_analytics: 'Аналитика',
      nav_logout: 'Выйти',
      nav_back: '← Назад',

      // LOGIN
      login_title: 'Вход для сотрудников',
      login_subtitle: 'Войдите, чтобы управлять очередью',
      login_email: 'Email',
      login_password: 'Пароль',
      login_btn: 'Войти',
      login_error: 'Неверный вход. Пожалуйста, попробуйте ещё раз.',
      footer_staff: 'QueueLeaf · Портал персонала',

      // JOIN
      join_welcome: 'Добро пожаловать',
      join_prompt: 'Введите данные, чтобы встать в очередь.',
      join_name: 'Ваше имя',
      join_name_ph: 'например, Alex',
      join_party: 'Размер группы',
      join_contact: 'Телефон или email (необязательно)',
      join_contact_ph: 'Для уведомлений',
      join_btn: 'Встать в очередь',
      join_terms: 'Присоединяясь, вы соглашаетесь получать обновления на месте. Приложение не нужно.',
      privacy_title: 'Уведомление о конфиденциальности',
      privacy_body:
        'Ваша информация (имя и контакты) используется только для управления вашим местом в очереди. После визита персональные данные обезличиваются. Анонимная активность очереди может сохраняться для аналитики.',
      privacy_accept: 'Понятно, согласен(на)',
      footer_customer: 'QueueLeaf · Портал клиента',

      // STATUS
      status_title: 'Статус очереди',
      status_your_number: 'Ваш номер',
      status_position: 'Позиция',
      status_est_wait: 'Ожидание',
      status_leave: 'Покинуть очередь',
      status_refresh: 'Обновить',
      status_called_banner: 'Вас вызывают! Пожалуйста, вернитесь к стойке.',
      status_your_position: 'Ваше место',
      status_estimated_wait: 'Ожидаемое время',
      status_queue_overview: 'Обзор очереди',
      status_privacy_policy: 'Политика конфиденциальности',
      status_wait_msg: 'Пожалуйста, ждите, пока не позовут ваше имя.',
      status_refresh_btn: 'Обновить статус',
      status_play_game: 'Сыграть в игру',
      // Status pill labels (RU)
      status_waiting: 'Ожидает',
      status_called: 'Позвали',
      status_served: 'Обслужено',
      status_left: 'Ушёл',
      // Controls
      enable_sound_alerts: 'Включить звуковые уведомления',
      footer_customer_status: 'QueueLeaf · Статус клиента',
      modal_queue_overview: 'Обзор очереди',
      modal_queue_label: 'Очередь',
      modal_people_ahead: 'Людей перед вами',
      modal_avg_service: 'Среднее время обслуживания',
      modal_queue: 'Очередь',
      modal_people_ahead: 'Людей впереди',
      modal_avg_service: 'Среднее время обслуживания',

      // DASHBOARD / MANAGE
      dash_title: 'Панель',
      dash_current_queue: 'Текущая очередь',
      dash_call_next: 'Позвать следующего',
      dash_mark_served: 'Обслужено',
      dash_remove: 'Удалить / Не явился',
      dash_close_queue: 'Закрыть очередь',
      dash_open_queue: 'Открыть очередь',
      footer_manager_dashboard: 'QueueLeaf · Панель менеджера',
      manage_cancel: 'Отмена',
      manage_save: 'Сохранить изменения',

      // Left-column summary labels (Manage Queue)
      summary_status: 'Статус',
      summary_waiting: 'В очереди',
      summary_served_today: 'Обслужено сегодня',

      // ANALYTICS
      analytics_title: 'Аналитика',
      footer_analytics_dashboard: 'QueueLeaf · Панель аналитики',
      // Analytics page specific (RU)
      date_range_7: 'Последние 7 дней',
      date_range_14: 'Последние 14 дней',
      date_range_30: 'Последние 30 дней',
      date_range_custom: 'Пользовательский диапазон',
      apply_button: 'Применить',
      live_refresh_label: 'Включить автoобновление (каждые 10 секунд)',
      total_tickets: 'Всего билетов',
      served: 'Обслужено',
      total_queues: 'Всего очередей',
      served_left_trend: 'Тренд: обслужено/ушло',
      avg_wait_time: 'Среднее время ожидания',
      peak_day_of_week: 'Пик по дням недели',
      heatmap_peak_hours: 'Тепловая карта: пиковые часы',
      axis_served: 'X: Дни • Y: Обслужено/Ушло клиентов',
      axis_wait: 'X: Дни • Y: Ср. ожидание (минуты)',
      axis_peak: 'X: День недели • Y: Посетителей',
      axis_heatmap: 'X: Час дня (0–23) • Y: День недели',
      heatmap_legend: 'Темные цвета = большая посещаемость',
      chart_label_served: 'Обслужено',
      chart_label_left: 'Покинул очередь',
      chart_label_avg_wait: 'Ср. ожидание (мин)',
      chart_label_customers: 'Клиенты',
      select_range_placeholder: 'Выберите диапазон',
        // Additional keys for dashboard/manage pages + JS (RU)
        create_new_queue: 'Создать новую очередь',
        your_queues: 'Ваши очереди',
        new_queue_btn: '+ Новая очередь',
        queue_name_label: 'Название очереди',
        queue_name_ph: 'напр., Main Dining',
        avg_service_label: 'Среднее время обслуживания (мин)',
        queue_qr_title: 'QR-код очереди',
        qr_close: 'Закрыть',
        qr_download: 'Скачать PNG',
        no_queues_created: 'Очереди ещё не созданы',
        create_queue_short: '+ Создать очередь',
        manage_label: 'Управлять',
        qr_label: 'QR',
        delete_label: 'Удалить',
        status_open: 'Открыта',
        status_closed: 'Закрыта',
        confirm_delete_queue: 'Вы уверены, что хотите удалить эту очередь?',
        confirm_force_delete: 'В этой очереди есть билеты. Принудительно удалить?',
        queue_name_required: 'Требуется имя очереди.',
        create_failed: 'Не удалось создать очередь. Проверьте консоль.',
        active_tickets: 'Активные билеты',
        table_name: 'Имя',
        table_party: 'Группа',
        table_status: 'Статус',
        table_joined: 'Вступил',
        table_called: 'Вызывался',
        table_served: 'Обслужен',
        table_left: 'Ушёл',
        table_contact: 'Контакт',
        table_actions: 'Действия',
        open_controls: 'Открыть управление',
        queue_controls: 'Управление очередью',
        toggle_open_close: 'Переключить Открыть/Закрыть',
        custom_message: 'Пользовательское сообщение',
        call_next: 'Позвать следующего',
        create_button: 'Создать',
          empty_create_hint: 'Нажмите кнопку выше, чтобы создать первую очередь.',
    },
  };

  function getLang() {
    return localStorage.getItem('lang') || 'en';
  }

  function setLang(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }

  function t(key) {
    const lang = getLang();
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
  }

  function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      el.setAttribute('placeholder', t(key));
    });

    // Title (optional)
    const titleKey = document.body && document.body.getAttribute('data-i18n-title');
    if (titleKey) document.title = t(titleKey) + ' · QueueLeaf';
  }

  function initLangSelector() {
    const select = document.getElementById('lang-select');
    if (!select) return;

    const current = getLang();
    select.value = current;
    setLang(current);

    select.addEventListener('change', (e) => {
      const lang = e.target.value;
      setLang(lang);
      applyTranslations();
    });
  }

  // Expose minimal API for other scripts if needed
  window.QueueLeafI18n = { getLang, setLang, t, applyTranslations };

  document.addEventListener('DOMContentLoaded', () => {
    initLangSelector();
    applyTranslations();
  });
})();
