CML Sample Grabber (non-Markdown)

Purpose:
Create high-quality CML 2.0 YAML files from open-source or public-domain whodunnits, then add them to examples/ as seed CMLs for novelty auditing.

What this folder contains:
- INSTRUCTIONS.txt: end-to-end workflow for generating a compliant CML 2.0 sample via ChatGPT.
- PROMPT.txt: a ready-to-paste prompt you can use with ChatGPT.
- CML2_TEMPLATE.yaml: a fully valid schema template you can fill in.
- SAMPLE_CML2.yaml: an example CML 2.0 file showing formatting (fictional, non-copyrighted).
- schema_snapshot.yaml: a snapshot of the current schema (schema/cml_2_0.schema.yaml).
- CHECKLIST.txt: quick validation checklist before you add a new sample.

Current seed CMLs in examples/:
- a_study_in_scarlet_cml2.yaml
- the_adventures_of_jimmie_dale_cml2.yaml
- the_big_bow_mystery_cml2.yaml
- the_clue_of_the_twisted_candle_cml2.yaml
- the_leak_cml2.yaml
- the_leavenworth_case_cml2.yaml
- the_lock_and_key_library_cml2.yaml
- the_memoirs_of_sherlock_holmes_cml2.yaml
- the_moonstone_cml2.yaml
- the_mysterious_affair_at_styles_cml2.yaml
- the_mystery_of_the_yellow_room_cml2.yaml
- the_old_man_in_the_corner_cml2.yaml
- the_second_key_cml2.yaml
- the_secret_adversary_cml2.yaml
- the_sign_of_the_four_cml2.yaml
- the_valley_of_fear_cml2.yaml
- trents_last_case_cml2.yaml

Where to put outputs:
- You may generate multiple books at once.
- Save each final YAML to examples/<short_title>_cml2.yaml
- Optional: keep a provenance note in examples/ or logs (source, license, URL, date)
- Zip all newly created YAML files together for download at the end (one archive containing all outputs)

Rules:
- Only use public-domain or open-source whodunnits.
- If you only provide a book title, the AI must rely on its own knowledge. If unsure, it must ask for a factual summary or mark fields as "Unknown" / [].
- Preserve the story’s logic and facts. Do not invent missing details.
- For edge-case testing, target inference_path of 6–7 tightly chained steps and set quality_controls accordingly.