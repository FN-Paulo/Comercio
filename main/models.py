from django.db import models

# Create your models here.

class Produto(models.Model):
	descricao = models.TextField(max_length=500)
	quantidade = models.IntegerField()
	preco_compra = models.FloatField()
	preco_venda = models.FloatField()

	def handle_buy_from_json(self, jsn):
                quant = int(jsn['quantidade'])
                self.quantidade-=quant
                self.save()
                
	

