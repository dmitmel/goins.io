#!/bin/sh

COLUMNS_COUNT=5
INPUT_FILES_SEP_NEWLINE=$(find app -name "*.js")
INPUT_FILES=""
COUNTER=0

for FILE in $INPUT_FILES_SEP_NEWLINE; do
    if [[ $COUNTER == 0 ]]; then
        INPUT_FILES="$FILE"
    elif [[ $(expr $COUNTER % $COLUMNS_COUNT) -eq 0 ]]; then
        INPUT_FILES="$INPUT_FILES\n$FILE"
    else
        INPUT_FILES="$INPUT_FILES $FILE"
    fi
    COUNTER=$((COUNTER + 1))
done

echo 'Generating JSON type definitions (http://ternjs.net/doc/manual.html#typedef) for these input files:'
echo '==================================================================================================='
echo "$INPUT_FILES" | column -t -s ' '
echo '==================================================================================================='
echo

PLUGINS=(modules es_modules)
for PLUGIN in "${PLUGINS[@]}"; do
    echo "Generating definitions for plugin ${PLUGIN}..."
    node_modules/tern/bin/condense app/index.js app/**/*.js --plugin $PLUGIN --name goins.io > .tern-definitions.$PLUGIN.json
done
