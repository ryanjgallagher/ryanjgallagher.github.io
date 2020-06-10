---
permalink: code/corex/overview
title: CorEx Topic Model
layout: page
hide_hero: true
hide_footer: true
menubar: code_menu
tabs: tabs_corex
---

# CorEx Topic Model

**Cor**relation **Ex**planation (CorEx) provides a flexible framework for learning topics that are maximally informative about a corpus of text. The CorEx topic model makes few assumptions about the latent structure of the data, and flexibly incorporates domain knowledge through user-specified "anchor words." Through anchor words, you can seed and guide the topic model towards topics of substantive interest, allowing you to interact with and refine topics in a way that is not possible with traditional topic models.

The details of the CorEx topic model and comparisons with unsupervised and semi-supervised variants of LDA are described in our TACL paper:

> Gallagher, R. J., Reing, K., Kale, D., & Ver Steeg, G. (2017). [Anchored Correlation Explanation: Topic Modeling with Minimal Domain Knowledge](/publications/gallagher2017anchored). *Transactions of the Association for Computational Linguistics (TACL)*, 5, 529-542.

An open-source implementation of the CorEx topic model is available in Python on PyPi (`corextopic`) and [on Github](https://github.com/gregversteeg/corex_topic).
