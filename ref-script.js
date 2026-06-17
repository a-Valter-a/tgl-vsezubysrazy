$(document).ready(function () {

	$('[data-submit]').on('click', function (e) {
		e.preventDefault();
		$(this).closest('form').submit();
	});

	$.validator.addMethod(
		"regex",
		function (value, element, regexp) {
			let re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		},
		"Please check your input."
	);

	// Функция валидации и вывода сообщений
	function valEl(el) {

		el.validate({
			rules: {

				phone: {
					required: true,
				},
				name: {
					required: true
				}
			},
			messages: {
				name: {
					required: 'Поле обязательно для заполнения',
				},
				phone: {
					required: 'Поле обязательно для заполнения',
				},
			},

			// Начинаем проверку id="" формы
			submitHandler: function (form) {
				let $form = $(form);
				let $formId = $(form).attr('id');
				switch ($formId) {
					case 'popupResult':
						$.ajax({
							type: 'POST',
							url: $form.attr('action'),
							data: $form.serialize(),
						})
							.always(function (response) {
								$('.popup-box').fadeOut();
								setTimeout(() => {
									$('.thanks').fadeIn();
								}, 1000);

								setTimeout(() => {
									$('.thanks').fadeOut();
								}, 4000);
								
								ym(93628985,'reachGoal','submit')
							});
						break;
				}
				return false;
			}
		})
	}

	// Запускаем механизм валидации форм, если у них есть класс .js-form
	$('.js-form').each(function () {
		valEl($(this));
	});
});