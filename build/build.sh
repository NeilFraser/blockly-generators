java -jar third-party-downloads/closure-compiler.jar\
	  --js ../core/*.mjs\
	  --js ../javascript/*.mjs\
	  --js ../javascript/*/*.mjs\
	  --js_output_file compressed.js
