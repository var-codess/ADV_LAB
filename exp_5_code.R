library(ggplot2)
library(dplyr)
library(reshape2)
library(rgl)
library(wordcloud)
library(tm)
library(tidyr)
library(readr)

boston_housing_data <- read_csv("D:/ADV Experiments/Experiment 5 Varada/BostonHousing.csv")
View(boston_housing_data)

# Bar plot for Chas (Proximity to Charles River)
ggplot(boston_housing_data, aes(x=factor(chas))) +
  geom_bar(fill="lightblue") +
  theme_minimal() +
  labs(title="Proximity to Charles River (chas)", x="Near Charles River (1=Yes, 0=No)", y="Count")

# Box plot for Tax
ggplot(boston_housing_data, aes(y=tax)) +
  geom_boxplot(fill="lightgreen") +
  theme_minimal() +
  labs(title="Box Plot of Property Tax Rate (Tax)", y="Property Tax Rate per $10,000")

# Violin plot for Nitrogen Oxides (Nox)
ggplot(boston_housing_data, aes(x=factor(chas), y=nox)) +
  geom_violin(fill="lightcoral") +
  theme_minimal() +
  labs(title="Violin Plot: Nox Concentration near Charles River", x="Near Charles River (1=Yes, 0=No)", y="Nitrogen Oxides Concentration")

# Linear regression plot: Crime Rate vs Tax
ggplot(boston_housing_data, aes(x=crim, y=tax)) +
  geom_point() +
  geom_smooth(method="lm", col="blue") +
  theme_minimal() +
  labs(title="Linear Regression: Crime Rate vs Property Tax", x="Per Capita Crime Rate", y="Property Tax Rate per $10,000")

ggplot(boston_housing_data, aes(x=indus, y=tax)) +
  geom_point() +
  geom_smooth(method="lm", col="blue") +
  theme_minimal() +
  labs(title="Linear Regression: Proportion of non-retail business acres per town. vs Property Tax", x="non-retail business acres per town.", y="Property Tax Rate per $10,000")

ggplot(boston_housing_data, aes(x=dis, y=tax)) +
  geom_point() +
  geom_smooth(method="lm", col="blue") +
  theme_minimal() +
  labs(title="Linear Regression:  Weighted distances to Boston employment centers vs Property Tax", x="distances to Boston employment centers", y="Property Tax Rate per $10,000")


# Nonlinear regression plot: Rooms vs Distance to Employment Centers
ggplot(boston_housing_data, aes(x=rm, y=dis)) +
  geom_point() +
  geom_smooth(method="loess", col="red") +
  theme_minimal() +
  labs(title="Nonlinear Regression: Rooms vs Distance to Employment Centers", x="Average Number of Rooms", y="Distance to Employment Centers")

# 3D scatter plot: Crime Rate, Tax, and Rooms
#library(rgl)
with(boston_housing_data, plot3d(crim, tax, rm, col="blue", size=3, type="s", xlab="Crime Rate", ylab="Tax", zlab="Rooms"))


# Jitter plot: Chas vs Radial Highway Accessibility
ggplot(boston_housing_data, aes(x=factor(chas), y=rad)) +
  geom_jitter(width=0.2, height=0.2, color="purple") +
  theme_minimal() +
  labs(title="Jitter Plot: Proximity to Charles River vs Radial Highway Accessibility", x="Near Charles River (1=Yes, 0=No)", y="Radial Highway Accessibility Index")
