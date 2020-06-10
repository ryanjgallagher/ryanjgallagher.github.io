---
permalink: code/word_shift/example
title: Word Shift Graphs
layout: page
hide_hero: true
hide_footer: true
menubar: code_menu
tabs: tabs_word_shift
---

# Installation

Python code for constructing word shift graphs is available via pip:

```bash
pip install shifterator
```

# Producing Word Shift Graphs

To produce a word shift graph, you need two dictionaries of the form `word2freq` where the keys are words and the values are the frequencies of those words in a text. With those in hand, you can produce a number of word shift graphs. Start by importing the shifts.

```
from shifterator import relative_shift as rs
from shifterator import symmetric_shift as ss
```

## Sentiment Shift

The Shifterator package includes a number of lexicons that can be used to quickly compare the sentiment between two texts. Here we use the English labMT sentiment dictionary:

```python
from shifterator import relative_shift as rs

# Get a sentiment word shift
sentiment_shift = rs.SentimentShift(reference=word2freq_1,
                                    comparison=word2freq_2,
                                    sent_dict_ref='labMT_English',
                                    sent_dict_comp='labMT_English')
sentiment_shift.get_shift_graph()
```

You can also provide score dictionaries where keys are words and values are scores according to a particular dictionary.

## Entropy Shifts

We can also use measures of entropy to compare two texts and how the relative abundance and distribution of words affects how they differ.

```python
# Get an entropy shift
entropy_shift = rs.EntropyShift(reference=word2freq_1,
                                comparison=word2freq_2,
                                base=2
entropy_shift.get_shift_graph()

# Get a Jensen-Shannon divergence shift
from shifterator import symmetric_shift as ss
jsd_shift = ss.JSDivergenceShift(system_1=word2freq_1,
                                 system_2=word2freq_2,
                                 base=2)
jsd_shift.get_shift_graph()
```

## More details

See the [Github page](https://github.com/ryanjgallagher/shifterator/) for more details of types of shifts that you can produce and parameters you can use to alter the word shift visualizations.
