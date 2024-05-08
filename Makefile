##################################################################
# Makefile for InfoSec Blueprints
##
# Author: John Menerick <code@haxx.ninja>
# Makefile Version: 1.0
# Date: 07/23
# Revision History:
# 1.0 (07/23) - Initial public version
#################################################################


### Usage
# install - Set up environmentss and install dependencies
# deps - Visualize dependencies
# lint - Lint source code
# format - Format source code
# docs - Generate documentation
# audit - Audit dependencies
# test - Run tests
# help - Show Help


# Notes:
#   - Running lint and tests together can hit governance & recursion limits  
#   - Documentation build may require network access
#   - If you wish to expand this project, please break into multiple Makefiles

#   - Sphinx (for docs)






##################
## Configuration
# Avoid parallel builds
.NOTPARALLEL: 

# Disable Make's implicit rules and variables
MAKEFLAGS += --no-implicit-rules
MAKEFLAGS += --no-builtin-variables

# Set shell
SHELL := /bin/bash

# Setup environments according to spec
AIENV := "Not available for public consumption."

# Documentation output
DOCS_OUT := docs

BUILD := build

#source code directory
SRC := src


#####################
## Build and Make
# Phony targets that don't produce files
.PHONY: all format install lint test docs clean help

# Default target
all: install generate enrich format lint test operate aigen aibuild aiassurance aisafety airesponsibleassurance aidei aideploy bigredbutton backpack clean docs audit help

#local dev steps target for public consumption
dev: install generate enrich format lint test operate docs audit #clean

#remote AIML dev environments
wandev: aigen aibuild aiassurance aisafety airesponsibleassurance aidei aideploy

#local public dev environments
localdev: clean install generate 

# Setup the environmentss
$(AIENV):
	echo "Not available for public consumption."

# Install dependencies and application code 
install: $(AIENV)
	mkdir -p $(BUILD)/Alpha2BetaVersions
	mkdir -p $(BUILD)/operator_books/actors
	mkdir -p $(BUILD)/aiml_books
	mkdir -p $(BUILD)/cyberAIgrandchallenge_books

	echo "prep the folder structure and organization"
	python $(SRC)/organize/Enterprise_createstructure.py
	python $(SRC)/organize/Mobile_createstructure.py
	python $(SRC)/organize/ICS_createstructure.py
	python $(SRC)/organize/CAR_Analytics.py

#generate the skeletons
generate: $(AIENV)
	echo "Skeleton generate the existing sigma sources\n"
	python $(SRC)/generate/SigmaLight.py

#enrich the skeletons by adding muscles, organs, bones
enrich:$(AIENV)
	echo "Not available for public consumption."


aigen:$(AIENV)
	echo "Not available for public consumption."

aibuild:($AIENV)
	echo "Not available for public consumption."

aideploy:$(AIENV)
	echo "Not available for public consumption."

aiassurance:$(AIENV)
	echo "Not available for public consumption."

airesponsibleassurance:$(AIENV)
	echo "Not available for public consumption."

aisafety:$(AIENV)
	echo "Not available for public consumption."

aidei:$(AIENV)
	echo "Not available for public consumption."

# Linting
lint: $(AIENV)
	echo "Not available for public consumption."


# Format the code and associated items
format: $(AIENV)
	echo "Not available for public consumption."


# Run tests & coverage
test: $(AIENV)
	echo "Not available for public consumption."


operate: $(AIENV)
	mv $(BUILD)/Alpha2BetaVersions $(DOCS_OUT)/Alpha2BetaVersions
	mv $(BUILD)/operator_books $(DOCS_OUT)/operator_books
	mv $(BUILD)/aiml_books $(DOCS_OUT)/aiml_books
	mv  $(BUILD)/cyberAIgrandchallenge_books $(DOCS_OUT)/cyberAIgrandchallenge_books 
	
# Generate documentation with Sphinx
docs: $(AIENV)
#	$(AIENV)/bin/sphinx-build docs $(DOCS_OUT)
#	$(AIENV)@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	mkdir -p $(DOCS_OUT)/operator_books
	mkdir -p $(DOCS_OUT)/aiml_books
	mkdir -p $(DOCS_OUT)/cyberAIgrandchallenge_books
	# Prep by moving over the template documentation into the applicable folders
	cp $(SRC)/public_templates/template_book.* $(DOCS_OUT)/operator_books/
	cp $(SRC)/public_templates/*.png $(DOCS_OUT)/operator_books/
	cp $(SRC)/public_templates/template_book.* $(DOCS_OUT)/aiml_books/
	cp $(SRC)/public_templates/*.png $(DOCS_OUT)/aiml_books/
	cp $(SRC)/public_templates/template_book.* $(DOCS_OUT)/cyberAIgrandchallenge_books/
	cp $(SRC)/public_templates/*.png $(DOCS_OUT)/cyberAIgrandchallenge_books/
	mv $(DOCS_OUT)/operator_books/template_book.md $(DOCS_OUT)/operator_books/README.md
	mv $(DOCS_OUT)/aiml_books/template_book.md $(DOCS_OUT)/aiml_books/README.md
	mv $(DOCS_OUT)/cyberAIgrandchallenge_books/template_book.md $(DOCS_OUT)/cyberAIgrandchallenge_books/README.md

# Audit supply chain
audit:
	echo "Not available for public consumption."

	
# Cleanup build artifacts
clean: 
	echo "Not available for public consumption."
	#Clean up the generated and enriched notebooks
	find $(DOCS_OUT) -name "*.ipynb" -exec rm {} \;

	#clean up the build section
	find $(BUILD) -name "*.ipynb" -exec rm {} \;
	rm -rf $(BUILD)
	mkdir -p $(BUILD)

	#clean up the docs
	rm -rf $(DOCS_OUT)/Alpha2BetaVersions
	rm -rf $(DOCS_OUT)/operator_books
	rm -rf $(DOCS_OUT)/aiml_books
	rm -rf $(DOCS_OUT)/cyberAIgrandchallenge_books 



# Help section
help:
	@echo "Makefile for InfoSec Blueprints"
	@echo
	@echo "Usage:"
	@echo "  make [target]"
	@echo
	@echo "Targets:"
	@echo "  install - Set up environmentss and install dependencies"
	@echo "  generate - Create the different artifacts for public consumption"
	@echo "  enrich - Enrich the public artifacts and objects for public consumption"
	@echo "  aigen - emerge the different behaviors and actions based upon the training datasets"
	@echo "  aibuild - build the corpus E2E to have assurance for a successful deployment"
	@echo "  aideploy - provenly E2E ship the systems and services with artifacts into 3rd party environments"
	@echo "  aiassurance - conduct assurance testing and provide assurances with disclaimers on the aiml-based operations"
	@echo "  airesponsibleassurance - conduct verification activities to provide assurances responsible behaviors and actions are conducted"
	@echo "  aisafety - conduct automated and semi-manual safety validation on aiml services/systems"
	@echo "  aidei - conduct dei validation on outcomes and training datasets on aiml-based systems/services"
	@echo "  operate - prep for local dev execution against WAN-based aiml instrumentation"									
	@echo "  clean - Cleanup build env and filters"
	@echo "  lint - Lint source code"
	@echo "  format - Format source code"
	@echo "  docs - Generate documentation"
	@echo "  audit - Audit dependencies"
	@echo "  test - Run public tests"
	@echo "  help - Show Help"
	@echo 
	@echo "The default target (make all or make with no arguments) will" 
	@echo "install, visualize deps, format, lint, generate docs, and test."
