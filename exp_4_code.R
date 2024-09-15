library(ggplot2)
library(dplyr)
library(reshape2)
library(rgl)
library(wordcloud)
library(tm)
library(tidyr)
library(readr)

data <- read_csv("D:/ADV Experiments/Experiment 4 Varada/10_Property_stolen_and_recovered.csv")
View(data)

# Bar Plot
ggplot(data, aes(x = Area_Name, y = Cases_Property_Stolen)) + 
  geom_bar(stat = "identity", fill = "steelblue") +
  theme(axis.text.x = element_text(angle = 90, hjust = 1)) +
  labs(title = "Total Property Stolen by Area", x = "Area", y = "Cases of Property Stolen")

# Pie Chart
stolen_data <- aggregate(Cases_Property_Stolen ~ Area_Name, data, sum)
ggplot(stolen_data, aes(x = "", y = Cases_Property_Stolen, fill = Area_Name)) +
  geom_bar(width = 1, stat = "identity") +
  coord_polar("y") +
  labs(title = "Proportion of Stolen Property Cases by Area")

# Histogram
ggplot(data, aes(x = Value_of_Property_Stolen)) + 
  geom_histogram(binwidth = 5000000, fill = "darkgreen", color = "black") +
  labs(title = "Distribution of Value of Property Stolen", x = "Value of Property Stolen", y = "Frequency")

# Line Chart
area_data <- data %>% filter(Area_Name == "Andhra Pradesh")
ggplot(area_data, aes(x = Year, y = Cases_Property_Stolen)) +
  geom_line(color = "blue") +
  labs(title = "Property Stolen Over Years in Andhra Pradesh", x = "Year", y = "Cases of Property Stolen")

# Scatter Plot: Stolen vs. Recovered Property Value
ggplot(data, aes(x = Value_of_Property_Stolen, y = Value_of_Property_Recovered)) + 
  geom_point(color = "red") +
  labs(title = "Stolen vs. Recovered Property Value", x = "Value of Property Stolen", y = "Value of Property Recovered")

# Bubble Plot: Stolen Property with Bubble Size Representing Cases
ggplot(data, aes(x = Value_of_Property_Stolen, y = Value_of_Property_Recovered, size = Cases_Property_Stolen)) +
  geom_point(alpha = 0.5, color = "purple") +
  labs(title = "Bubble Plot: Stolen vs Recovered Property", x = "Value of Property Stolen", y = "Value of Property Recovered", size = "Cases Property Stolen")

# Distribution of Recovered Property Values
ggplot(data, aes(x = Value_of_Property_Recovered)) + 
  geom_histogram(binwidth = 5000000, fill = "dodgerblue", color = "black") +
  labs(title = "Distribution of Value of Property Recovered", x = "Value of Property Recovered", y = "Frequency")

# Comparison of Stolen and Recovered Property Cases Over Time
area_data <- data %>% filter(Area_Name == "Andhra Pradesh") # Change area as needed
ggplot(area_data) +
  geom_line(aes(x = Year, y = Cases_Property_Stolen, color = "Stolen"), size = 1) +
  geom_line(aes(x = Year, y = Cases_Property_Recovered, color = "Recovered"), size = 1) +
  labs(title = "Comparison of Stolen and Recovered Property Cases Over Time", x = "Year", y = "Number of Cases") +
  scale_color_manual(values = c("Stolen" = "red", "Recovered" = "green"), name = "Property") +
  theme_minimal()

