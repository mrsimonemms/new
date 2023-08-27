CHECKOUT ?= main
REPO ?= https://github.com/mrsimonemms/new

.create:
	@cruft create ${REPO} --skip=.git --directory ${DIRECTORY} --checkout ${CHECKOUT}
.PHONY: .create

blank:
	@$(MAKE) .create DIRECTORY=blank
.PHONY: blank

golang-cobra:
	@$(MAKE) .create DIRECTORY=golang-cobra
.PHONY: golang-cobra

js:
	@$(MAKE) .create DIRECTORY=js
.PHONY: js
