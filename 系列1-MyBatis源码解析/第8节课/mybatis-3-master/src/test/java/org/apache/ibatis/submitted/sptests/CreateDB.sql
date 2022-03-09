/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Copyright 2021-2022 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Copyright 2021-2021 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Copyright [$tody.year] [Wales Yu of copyright owner]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

--
--    Copyright ${license.git.copyrightYears} the original author or authors.
--
--    Licensed under the Apache License, Version 2.0 (the "License");
--    you may not use this file except in compliance with the License.
--    You may obtain a copy of the License at
--
--       http://www.apache.org/licenses/LICENSE-2.0
--
--    Unless required by applicable law or agreed to in writing, software
--    distributed under the License is distributed on an "AS IS" BASIS,
--    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
--    See the License for the specific language governing permissions and
--    limitations under the License.
--

drop procedure sptest.getnames if exists
go

drop procedure sptest.getname if exists
go

drop procedure sptest.adder if exists
go

drop procedure sptest.arraytest if exists
go

drop table sptest.names if exists
go

drop table sptest.items if exists
go

drop schema sptest if exists
go

create schema sptest
go

create procedure sptest.adder(in addend1 integer, in addend2 integer, out theSum integer)
begin atomic
  set theSum = addend1 + addend2; 
end
go

create table sptest.names (
  id integer,
  first_name varchar(20),
  last_name varchar(20),
  primary key(id)
)
go

insert into sptest.names (id, first_name, last_name) values(0, 'Fred', 'Flintstone')
go

insert into sptest.names (id, first_name, last_name) values(1, 'Wilma', 'Flintstone')
go

insert into sptest.names (id, first_name, last_name) values(2, 'Barney', 'Rubble')
go

insert into sptest.names (id, first_name, last_name) values(3, 'Betty', 'Rubble')
go

create table sptest.items (
  id integer generated by default as identity not null,
  item varchar(20),
  name_id integer,
  primary key(id)
)
go

insert into sptest.items (item, name_id) values('Brontosaurus Burger', 0)
go

insert into sptest.items (item, name_id) values('Lunch Box', 0)
go

insert into sptest.items (item, name_id) values('Helmet', 1)
go

-- note that these create procedure statements will fail until hsqldb 2.0.1
create procedure sptest.getname(in nameId integer)
modifies sql data
dynamic result sets 1
BEGIN ATOMIC
  declare cur cursor for select * from sptest.names where id = nameId;
  open cur;
END
go

create procedure sptest.getnamesanditems()
modifies sql data
dynamic result sets 2
BEGIN ATOMIC
  declare cur1 cursor for select * from sptest.names;
  declare cur2 cursor for select * from sptest.items;
  open cur1;
  open cur2;
END
go

create procedure sptest.getnamesanditemsbyid(in nameId integer)
modifies sql data
dynamic result sets 2
BEGIN ATOMIC
  declare cur1 cursor for select * from sptest.names where id = nameId;
  declare cur2 cursor for select * from sptest.items where name_id in (select id from sptest.names where id = nameId);
  open cur1;
  open cur2;
END
go

create procedure sptest.getnames(in lowestId int, out totalrows integer)
modifies sql data
dynamic result sets 1
BEGIN ATOMIC
  declare cur cursor for select * from sptest.names where id >= lowestId;
  select count(*) into totalrows from sptest.names where id >= lowestId;
  open cur;
END
go

create procedure sptest.getnamesLowHigh(in lowestId int, in highestId int)
modifies sql data
dynamic result sets 1
BEGIN ATOMIC
  declare cur cursor for select * from sptest.names where id >= lowestId and id <= highestId;
  open cur;
END
go

create procedure sptest.arraytest(in ids int array, out rowsrequested integer, out returnedids int array)
modifies sql data
dynamic result sets 1
begin atomic
  declare cur cursor for select * from sptest.names where id in (unnest(ids));
  set rowsrequested = cardinality(ids);
  set returnedids = array [7, 8, 9, 10];
  open cur;
end
go

create procedure sptest.echoDate(in inputDate date, out outputDate date)
begin atomic
  set outputDate = inputDate; 
end
go

create table sptest.books (
  id integer not null,
  name varchar(20),
  genre1 integer,
  genre2 integer,
  primary key(id)
)
go

insert into sptest.books (id, name, genre1, genre2) values
(1, 'Book1', 10, 11),
(2, 'Book2', 10, 12),
(3, 'Book3', 10, 11)
go

create table sptest.genres (
  id1 integer,
  id2 integer,
  name varchar(20)
)
go

insert into sptest.genres (id1, id2, name) values
(10, 11, 'Genre1'),
(10, 12, 'Genre2'),
(10, 13, 'Genre3')
go

create procedure sptest.getbookandgenre()
modifies sql data
dynamic result sets 2
BEGIN ATOMIC
  declare cur1 cursor for select * from sptest.books order by id;
  declare cur2 cursor for select * from sptest.genres;
  open cur1;
  open cur2;
END
go
