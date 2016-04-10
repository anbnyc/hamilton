long <- read.csv("~/Downloads/Hamilton - Album Long.csv")
long <- data.table(long)
title_lookup <- unique(long[,.(id,trackName)])
parts <- long[part != "Company",.(id,part)]
cross <- merge(parts,parts,by="id",allow.cartesian=TRUE)
#cross <- cross[part.x != part.y,]
cross <- merge(cross,title_lookup,by="id")
pivot <- cross
pivot [,part := paste0(part.x,"_",part.y)]
pivot[,part.x:=NULL]
pivot[,part.y:=NULL]
pivot[,id := NULL]
pivot[,num := seq_len(.N), by=.(part)]
pivot[,ntracks := .N,by=.(part)]

cast <- unique(parts$part)
fullcross <- merge(cast,cast)
fullcross$part <- paste(fullcross$x,fullcross$y,sep="_")
fullcross <- merge(fullcross,pivot,by="part",all.x=T)
fullcross$x <- NULL
fullcross$y <- NULL

spread <- tbl_df(fullcross) %>%
    mutate(num = ifelse(is.na(num),0,num),
           ntracks = ifelse(is.na(ntracks),0,ntracks)) %>%
    spread(num,trackName) %>%
    unite("tracks",3:33,sep=";") %>%
    mutate(tracks = gsub(";NA","",tracks),
           tracks = gsub("NA;","",tracks)) %>%
    separate(part,c("part1","part2"),sep="_")

json <- toJSON(spread)
