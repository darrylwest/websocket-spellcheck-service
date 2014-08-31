install:
	@make npm
	@( [ -d logs ] || mkdir logs )

npm:
	@npm install

test:
	@grunt test

watch:
	@grunt server

browser:
	cat browser/SpellCheckClient.js

.PHONY: install
.PHONY: npm
.PHONY: test
.PHONY: watch
.PHONY: browser
