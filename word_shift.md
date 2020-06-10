---
permalink: code/word_shift/overview
title: Word Shift Graphs
layout: page
hide_hero: true
hide_footer: true
menubar: code_menu
tabs: tabs_word_shift
---

# Word Shift Graphs

Word shift graphs are vertical bar charts which quantify *which* words contribute to a difference between two texts, and *how* they contribute. By allowing you to look at changes in how words are used, word shifts help you conduct more interpretable text analyses. Word shift graphs can be used for comparing texts according to word proportions, sentiment , or more complex entropy-based measures such as the Kullback-Leibler or Jensen-Shannon divergence. Generally, any word-score dictionary can be used with a word shift graph to disentangle the differences between two texts. If you are ever thinking of using a word cloud in a scientific analysis, use a word shift graph instead.

An open-source implementation of word shift graphs is available in Python on PyPi (`shifterator`) and [on Github](https://github.com/ryanjgallagher/shifterator/).

<p align="center">
  <img src ="/files/imgs/word_shift.png" width="50%"/>
</p>

To get a handle on how to read word shift graphs, see the following paper:

> Dodds, P. S., Harris, K. D., Kloumann, I. M., Bliss, C. A., & Danforth, C. M. (2011). Temporal Patterns of Happiness and Information in a Global Social Network: Hedonometrics and Twitter. *PLoS ONE*, 6(12).
