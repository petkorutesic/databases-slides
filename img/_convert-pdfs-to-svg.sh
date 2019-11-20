#/bin/bash

for name in *.pdf; do
	TMPNAME="$name.tmp"
	SVGNAME="`basename $name .pdf`.svg"

	if [ "$name" -nt "$SVGNAME" ]; then
		echo "Converting $name"
		pdfcrop --margins 0 "$name" "$TMPNAME" && mv "$TMPNAME" "$name" && rm -f "$TMPNAME"
		pdf2svg	$name $SVGNAME
	else 
		echo "Skipping $name"
	fi

done
