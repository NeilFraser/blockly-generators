java -jar third-party-downloads/closure-compiler.jar\
	  --js ../core/*.mjs\
	  --js ../javascript/*.mjs\
	  --js ../javascript/*/*.mjs\
	  --js ../tests/node.mjs\
		--compilation_level ADVANCED_OPTIMIZATIONS\
	  --js_output_file compressed.js
