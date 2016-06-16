import json
from urllib.parse import unquote

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from django.core.urlresolvers import reverse

from .models import Produto

# Create your views here.

def home(request):
        #return HttpResponse('home')
        return render(request, 'main/home.html', {})
        
def venda(request):
        if request.method == 'GET':
                if request.GET.get('finalizarCompra'):
                        obj = json.loads(unquote(request.GET.get('finalizarCompra')))
                        produtos = obj['produtos']
                        print('quantiade de produtos: ',len(produtos))
                        for prod in produtos:
                                obj = get_object_or_404(Produto, id=int(prod['_id']))
                                obj.handle_buy_from_json(prod)
                                print(prod['quantidade'],111111)
                        
        return render(request, 'main/venda.html', {})

        
def estoque(request):
        if 'desc' in request.GET.keys():
                print('tentato')
                desc = request.GET['desc']
                if desc == 'undefined':
                        desc = ''
                s = Produto.objects.filter(descricao__icontains=desc).filter(quantidade__gt=0)
                ests = []
                for p in s:
                        d = {}
                        d['_id'] = p.id
                        d['descricao'] = p.descricao
                        d['quantidade'] = p.quantidade
                        d['precoCompra'] = p.preco_compra
                        d['precoVenda'] = p.preco_venda
                        ests.append(d)
                ests = json.dumps(ests)
                return HttpResponse(ests, content_type='application/json')
        context = {}
        if 'addItem' in request.POST.keys() or 'editarItem' in request.POST.keys():
                desc = request.POST['descricao']
                q = int(request.POST['quantidade'])
                pc = float(request.POST['precoCompra'])
                pv = float(request.POST['precoVenda'])
                
                if 'addItem' in request.POST.keys():
                        prod = Produto.objects.create(descricao=desc, quantidade=q, preco_compra=pc, preco_venda=pv)
                        prod.save()
                else:
                        _id = int(request.POST['_id'])
                        prod = Produto.objects.get(id=_id)
                        prod.descricao = desc
                        prod.quantidade = q
                        prod.preco_compra = pc
                        prod.preco_venda = pv
                        prod.save()
                
        if request.GET.get('editar'):
                i = int(request.GET['editar'])
                try: produto = Produto.objects.get(id=i)
                except ObjectDoesNotExist: produto = None
                if produto:
                        context['editar_item'] = True
                context['produto'] = produto
                
        if request.GET.get('apagar'):
                i = int(request.GET['apagar'])
                try:
                        produto = Produto.objects.get(id=i)
                        produto.delete()
                except ObjectDoesNotExist:
                        pass
        
        estoque = Produto.objects.all()
        
        paginator = Paginator(estoque, 10)
        page = request.GET.get('page')
        
        try:
                estoque = paginator.page(page)
        except PageNotAnInteger:
                estoque = paginator.page(1)
                
        except EmptyPage:
                estoque = paginator.page(paginator.num_pages)
                
        context['estoque'] = estoque
            
        return render(request, 'main/estoque.html', context)
                
