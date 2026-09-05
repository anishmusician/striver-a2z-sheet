import urllib.request
import ssl
import json
import re
import os
import time
import concurrent.futures

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

OUTPUT_FILE = 'src/data/problem-details.json'

def extract_problem_from_html(slug, html):
    raw_matches = re.findall(r'self\.__next_f\.push\(\[1,\s*\"(.*?)\"\s*\]\)', html, re.DOTALL)
    full_stream = ''
    for m in raw_matches:
        try:
            full_stream += json.loads('\"' + m + '\"')
        except:
            full_stream += m.encode('utf-8').decode('unicode_escape', errors='ignore')
    
    pos = full_stream.find(f'\"problemSlug\":\"{slug}\",\"data\":')
    if pos == -1:
        # Try generic search for problem_slug
        pos = full_stream.find(f'\"problem_slug\":\"{slug}\"')
        if pos != -1:
            data_start = full_stream.rfind('{\"problem_type\"', 0, pos)
            if data_start != -1:
                depth = 0
                for i in range(data_start, len(full_stream)):
                    if full_stream[i] == '{': depth += 1
                    elif full_stream[i] == '}':
                        depth -= 1
                        if depth == 0:
                            try:
                                return json.loads(full_stream[data_start:i+1])
                            except:
                                return None
        return None

    start = pos + len(f'\"problemSlug\":\"{slug}\",\"data\":')
    depth = 0
    end = -1
    for i in range(start, len(full_stream)):
        if full_stream[i] == '{': depth += 1
        elif full_stream[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    if end != -1:
        try:
            return json.loads(full_stream[start:end])
        except:
            return None
    return None

def fetch_single_problem(slug):
    url = f'https://takeuforward.org/plus/dsa/problems/{slug}'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        raw_data = extract_problem_from_html(slug, html)
        if raw_data:
            return slug, {
                'slug': slug,
                'name': raw_data.get('problem_name') or slug.replace('-', ' ').title(),
                'statement': raw_data.get('problem_statement') or '',
                'example1': raw_data.get('example1'),
                'example2': raw_data.get('example2'),
                'example3': raw_data.get('example3'),
                'constraints': raw_data.get('constraints'),
                'hints': [h.get('hint') for h in raw_data.get('hints', []) if isinstance(h, dict) and h.get('hint') and 'Subscribe' not in h.get('hint', '')],
                'testcases': raw_data.get('testcases', []),
                'starters': {
                    'cpp': raw_data.get('publicCpp'),
                    'java': raw_data.get('publicJava'),
                    'python': raw_data.get('publicPy'),
                    'javascript': raw_data.get('publicJs'),
                }
            }
        return slug, None
    except Exception as e:
        return slug, None

def main():
    with open('src/data/a2z-sheet.json', 'r') as f:
        sheet = json.load(f)

    # Collect slugs mapped to problem IDs
    slug_to_prob = {}
    for s in sheet['steps']:
        for sub in s['subcategories']:
            for p in sub['problems']:
                if p.get('plus'):
                    slug = p['plus'].replace('/plus/dsa/problems/', '').split('?')[0].strip('/')
                    if slug and slug not in slug_to_prob:
                        slug_to_prob[slug] = p

    print(f'Total unique slugs to fetch: {len(slug_to_prob)}')

    existing_details = {}
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r') as f:
                existing_details = json.load(f)
            print(f'Loaded {len(existing_details)} existing problem details from cache.')
        except:
            existing_details = {}

    to_fetch = [slug for slug in slug_to_prob if slug not in existing_details]
    print(f'Remaining to fetch: {len(to_fetch)}')

    if to_fetch:
        count = 0
        batch_size = 15
        with concurrent.futures.ThreadPoolExecutor(max_workers=batch_size) as executor:
            future_to_slug = {executor.submit(fetch_single_problem, slug): slug for slug in to_fetch}
            for future in concurrent.futures.as_completed(future_to_slug):
                slug, data = future.result()
                count += 1
                if data:
                    existing_details[slug] = data
                
                if count % 25 == 0 or count == len(to_fetch):
                    print(f'[{count}/{len(to_fetch)}] Processed. Total collected so far: {len(existing_details)}')
                    with open(OUTPUT_FILE, 'w') as f:
                        json.dump(existing_details, f, indent=2)

    print(f'Finished fetching. Total cached problems: {len(existing_details)}')
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(existing_details, f, indent=2)

if __name__ == '__main__':
    main()
