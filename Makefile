CHECKOUT ?= main
REPO ?= https://github.com/mrsimonemms/new

.create:
	@cruft create ${REPO} --skip=.git --directory ${DIRECTORY} --checkout ${CHECKOUT}
.PHONY: .create

.update-precommit:
	@cd "${DIRECTORY}" && pre-commit autoupdate
.PHONY: .update-precommit

blank:
	@$(MAKE) .create DIRECTORY=blank
.PHONY: blank

golang-cobra:
	@$(MAKE) .create DIRECTORY=golang-cobra
.PHONY: golang-cobra

precommit-autoupdate:
	@$(MAKE) .update-precommit DIRECTORY=.
	@$(MAKE) .update-precommit DIRECTORY="blank/{{ cookiecutter.project_name }}"
	@$(MAKE) .update-precommit DIRECTORY="golang-cobra/{{ cookiecutter.project_name }}"
.PHONY: precommit-autoupdate
