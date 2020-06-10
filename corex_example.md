---
permalink: code/corex/example
title: CorEx Topic Model
layout: page
hide_hero: true
hide_footer: true
menubar: code_menu
tabs: tabs_corex
---

# Installation

Python code for the CorEx topic model is available via pip:

```bash
pip install corextopic
```


# Running the CorEx Topic Model

The CorEx topic model takes a document by word matrix as input.

```python
import numpy as np
import scipy.sparse as ss
from corextopic import corextopic as ct

# Define a matrix where rows are samples (docs) and columns are features (words)
X = np.array([[0,0,0,1,1],
              [1,1,1,0,0],
              [1,1,1,1,1]], dtype=int)
# Sparse matrices are also supported
X = ss.csr_matrix(X)
# Word labels for each column can be provided to the model
words = ['dog', 'cat', 'fish', 'apple', 'orange']
# Document labels for each row can be provided
docs = ['fruit doc', 'animal doc', 'mixed doc']

# Train the CorEx topic model
topic_model = ct.Corex(n_hidden=2)  # Define the number of latent (hidden) topics to use.
topic_model.fit(X, words=words, docs=docs)
```

Once the model is trained, the topics can be accessed through the `get_topics()` function. Words are ranked according to their mutual information with the topic.

```python
topics = topic_model.get_topics()
for topic_n,topic in enumerate(topics):
    words,mis = zip(*topic)
    topic_str = str(topic_n+1)+': '+','.join(words)
    print(topic_str)
```

Similarly, the most probable documents for each topic can be accessed through the `get_top_docs()` function.

```python
top_docs = topic_model.get_top_docs()
for topic_n, topic_docs in enumerate(top_docs):
    docs,probs = zip(*topic_docs)
    topic_str = str(topic_n+1)+': '+','.join(docs)
    print(topic_str)
```


# Hierarchical Topic Modeling

For the CorEx topic model, topics are binary latent factors that can be expressed or not in each document. We can hierarchically model the topics by making another a document by topic matrix and using that as input for another CorEx topic model. We can iterate to build a hierarchical representation of topics.

```python
# Train the first layer
topic_model = ct.Corex(n_hidden=100)
topic_model.fit(X)

# Train successive layers
tm_layer2 = ct.Corex(n_hidden=10)
tm_layer2.fit(topic_model.labels)

tm_layer3 = ct.Corex(n_hidden=1)
tm_layer3.fit(tm_layer2.labels)
```

# Semi-Supervised Topic Modeling

Anchored CorEx allows a user to anchor words to topics in a semi-supervised fashion to uncover otherwise elusive topics. If ```words``` is initialized, anchoring is straightforward:

```python
topic_model.fit(X, words=words, anchors=[['dog','cat'], 'apple'], anchor_strength=2)
```

This anchors "dog" and "cat" to the first topic, and "apple" to the second topic. You can anchor in many creative ways. For example:

1. *Anchor a single set of words to a single topic*. This can help promote a topic that did not naturally emerge when running an unsupervised instance of the CorEx topic model. For example, one might anchor words like "snow," "cold," and "avalanche" to a topic if one suspects there should be a snow avalanche topic within a set of disaster relief articles.
```python
topic_model.fit(X, words=words, anchors=[['snow', 'cold', 'avalanche']], anchor_strength=4)
```

2. *Anchor single sets of words to multiple topics*. This can help find different aspects of a topic that may be discussed in several different contexts. For example, one might anchor "protest" to three topics and "riot" to three other topics to understand different framings that arise from tweets about political protests.
```python
topic_model.fit(X, words=words, anchors=['protest', 'protest', 'protest', 'riot', 'riot', 'riot'], anchor_strength=2)
```

3. *Anchor different sets of words to multiple topics.* This can help enforce topic separability if there appear to be chimera topics. For example, one might anchor "mountain," "Bernese," and "dog" to one topic and "mountain," "rocky," and "colorado" to another topic to help separate topics that merge discussion of Bernese Mountain Dogs and the Rocky Mountains.
```python
topic_model.fit(X, words=words, anchors=[['bernese', 'mountain', 'dog'], ['mountain', 'rocky', 'colorado']], anchor_strength=2)
```

# Detailed Tutorial

For a more detailed tutorial of how to run the CorEx topic model, extract information from it, choose the number of topics, and run hierarchical and semi-supervised models, see [this Jupyter notebook](https://github.com/gregversteeg/corex_topic/blob/master/corextopic/example/corex_topic_example.ipynb).
