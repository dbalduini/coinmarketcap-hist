from bs4 import BeautifulSoup
import re
from data import historical_urls
import concurrent.futures
import urllib.request

def remove_double_spaces(s):
    return re.sub(r'\s{2,}', '', s, flags=re.MULTILINE)

def get_clean_text(el):
    txt = el.get_text().strip()
    txt = remove_double_spaces(txt)
    return txt

def get_csv_row(tr, el):
    row = []
    # for each row <tr>
    for td in tr.find_all(el):
        # for each column <td>
        txt = get_clean_text(td)
        row.append(txt)
    return row

def download_csv_data(url, timeout=60):
    csv_data = []
    sep = '|'

    # open the url
    #print('Downloading data from url %s' % (url))
    f = urllib.request.urlopen(url, timeout=timeout)
    html = f.read()

    # soup html parser
    soup = BeautifulSoup(html, 'html.parser')

    # get the last h1 tag
    h1 = soup.find_all('h1')[-1]
    title = get_clean_text(h1)

    table = soup.find('table')
    thead = table.find('thead')
    tbody = table.find('tbody')

    # append the csv head
    for tr in thead.find_all('tr'):
        row = get_csv_row(tr, 'th')
        row.append('Not Mineable')
        row.append('Significantly Premined')
        line = sep.join(row)
        csv_data.append(line)

    # append csv data
    for tr in tbody.find_all('tr'):
        row = get_csv_row(tr, 'td')

        # enrich data - circulating supply
        not_mineable = False
        significantly_premined = False
        circulating_supply = row[5]
        if re.search(r'[*]{2}$', circulating_supply):
            significantly_premined = True
            row[5] = circulating_supply[:-2]
        elif re.search(r'[*]{1}$', circulating_supply):
            not_mineable = True
            row[5] = circulating_supply[:-1]

        row.append(str(not_mineable))
        row.append(str(significantly_premined))

        line = sep.join(row)
        csv_data.append(line)

    write_csv(csv_data, title)
    return title

def write_csv(csv_data, title):
    with open('data/' + title + '.csv', 'w') as output:
        for line in csv_data:
            output.write(line)
            output.write('\n')

if __name__ == '__main__':
    r = len(historical_urls)
    print('Total data to download:', r)

    errors = []

    # We can use a with statement to ensure threads are cleaned up promptly
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        # Start the load operations and mark each future with its URL
        future_to_url = {executor.submit(download_csv_data, url, 60): url for url in historical_urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                data = future.result()
            except Exception as exc:
                errors.append(url)
                print('%r generated an exception: %s' % (url, exc))
            else:
                print('downloaded: %r from %r' % (data, url))
    print(errors)
