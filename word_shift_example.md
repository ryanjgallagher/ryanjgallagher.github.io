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

To produce a word shift graph, you need two dictionaries of the form `word2freq` where the keys are words and the values are the frequencies of those words in a text. With those in hand, you can produce a number of word shift graphs. Start by importing the package.

```
import shifterator as sh
```

## Sentiment Shift

The Shifterator package includes a number of lexicons that can be used to quickly compare the sentiment between two texts. Here we use the English labMT sentiment dictionary:

```python
sentiment_shift = sh.WeightedAvgShift(type2freq_1=word2freq_1,
                                      type2freq_2=word2freq_2,
                                      type2score_1='labMT_English',
                                      type2score_2='labMT_English')
sentiment_shift.get_shift_graph()
```

You can also provide score dictionaries where keys are words and values are scores according to a particular dictionary.

## Entropy Shifts

We can also use measures of entropy to compare two texts and how the relative abundance and distribution of words affects how they differ. The emphasis on rare or common words can be controlled through the [Tsallis entropy](https://en.wikipedia.org/wiki/Tsallis_entropy) `alpha` parameter.

```python
# Get an entropy shift
entropy_shift = sh.EntropyShift(type2freq_1=word2freq_1,
                                type2freq_2=word2freq_2,
                                base=2,
                                alpha=1.0)
entropy_shift.get_shift_graph()

# Get a Jensen-Shannon divergence shift
jsd_shift = sh.JSDivergenceShift(type2freq_1=word2freq_1,
                                 type2freq_2=word2freq_2,
                                 base=2,
                                 alpha=1.0)
jsd_shift.get_shift_graph()
```

## More details

See the [official documentation](https://shifterator.readthedocs.io/en/latest/) for more details on the types of shifts that you can produce and a comprehensive cookbook of how to use them.
